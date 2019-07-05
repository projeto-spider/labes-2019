const PDFDocument = require('pdfkit')
const errors = require('../../../shared/errors')
const utils = require('../../utils')
const Defense = require('../../models/Defense')
const Cd = require('../../models/tccdocs/cd')
const Ata = require('../../models/tccdocs/ata')
const Certificado = require('../../models/tccdocs/certificado')
const Credenciamento = require('../../models/tccdocs/credenciamento')
const Divulgacao = require('../../models/tccdocs/divulgacao')

function translate(info) {
  const translations = {
    cbcc: 'Ciência da Computação',
    cbsi: 'Sistemas de Informação',
    doctor: 'Dr(a). ',
    master: 'MSc. ',
    other: '',
    '1': 'Janeiro',
    '2': 'Fevereiro',
    '3': 'Março',
    '4': 'Abril',
    '5': 'Maio',
    '6': 'Junho',
    '7': 'Julho',
    '8': 'Agosto',
    '9': 'Setembro',
    '10': 'Outubro',
    '11': 'Novembro',
    '12': 'Dezembro'
  }
  return translations[info] || info
}

module.exports = async function generateAllDocs(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])
  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }
  const { id, files } = ctx.params
  if (
    ![
      'ata',
      'cd',
      'certificado1',
      'certificado2',
      'certificado3',
      'certificado4',
      'certificado5',
      'certificado6',
      'certificado7',
      'credenciamento1',
      'credenciamento2',
      'credenciamento3',
      'divulgacao',
      undefined
    ].includes(files)
  ) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST, param: files }
    return
  }
  const defenseFind = await Defense.where('id', id).fetch()
  if (defenseFind === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }
  const defenseDate = defenseFind.get('date')
  const date = new Date()
  const dados = {
    curso: translate(defenseFind.get('course')),
    tituloTCC: defenseFind.get('title'),
    nomeDosAlunos: defenseFind.get('students').replace(/, /g, '\n'),
    tituloOrientador: translate(defenseFind.get('advisorTitle')),
    orientador: defenseFind.get('advisorName'),
    tituloCoOrientador: translate(defenseFind.get('coAdvisorTitle')),
    coOrientador: defenseFind.get('coAdvisorName'),
    tituloAvaliador1: translate(defenseFind.get('evaluator1Title')),
    avaliador1: defenseFind.get('evaluator1Name'),
    tituloAvaliador2: translate(defenseFind.get('evaluator2Title')),
    avaliador2: defenseFind.get('evaluator2Name'),
    tituloAvaliador3: translate(defenseFind.get('evaluator3Title')),
    avaliador3: defenseFind.get('evaluator3Name'),
    diaDefesa: defenseDate.split('/')[0],
    mesDefesa: translate(Number(defenseDate.split('/')[1])),
    anoDefesa: defenseDate.split('/')[2],
    dia: date.getUTCDate(),
    mes: translate(date.getUTCMonth()),
    ano: date.getUTCFullYear(),
    tituloDiretor: translate('doctor'),
    diretor: 'Josivaldo de Souza Araújo',
    matricula: defenseFind.get('registrationNumbers').split(', ')[0],
    discente: defenseFind.get('students').split(', ')[0],
    palavrasChave: defenseFind.get('keywords'),
    horarioDefesa: defenseFind.get('time').slice(0, -3),
    salaDefesa: defenseFind.get('local'),
    resumo: defenseFind.get('summary'),
    isDiscente: false,
    aprovado: !defenseFind.get('passed') ? 'reprovado' : 'aprovado',
    conceito: 'insuficiente'
  }
  if (
    ![
      'curso',
      'tituloTCC',
      'nomeDosAlunos',
      'orientador',
      'avaliador1',
      'avaliador2',
      'diaDefesa',
      'mesDefesa',
      'anoDefesa',
      'diretor',
      'matricula',
      'discente',
      'horarioDefesa',
      'salaDefesa'
    ].every(item => dados[item] !== '')
  ) {
    ctx.status = 400
    ctx.body = { code: errors.UNPROCESSABLE_ENTITY }
    return
  }
  const grade = defenseFind.get('grade')
  if (grade >= 5) dados.conceito = 'regular'
  if (grade >= 7) dados.conceito = 'bom'
  if (grade >= 9) dados.conceito = 'excelente'
  const people = [
    {
      name: dados.orientador,
      title: dados.tituloOrientador,
      condition: 'orientador',
      isDiscente: false
    },
    {
      name: dados.coOrientador,
      title: dados.tituloCoOrientador,
      condition: 'co-orientador',
      isDiscente: false
    },
    {
      name: dados.avaliador1,
      title: dados.tituloAvaliador1,
      condition: 'avaliador',
      isDiscente: false
    },
    {
      name: dados.avaliador2,
      title: dados.tituloAvaliador2,
      condition: 'avaliador',
      isDiscente: false
    },
    {
      name: dados.avaliador3,
      title: dados.tituloAvaliador3,
      condition: 'avaliador',
      isDiscente: false
    },
    {
      name: dados.discente,
      title: '',
      condition: 'discente',
      isDiscente: true
    },
    {
      name: dados.nomeDosAlunos.split('\n')[1],
      title: '',
      condition: 'discente',
      isDiscente: true
    }
  ]
  const validPeople = people.filter(person => person.name !== null)
  const evaluators = [
    {
      name: dados.avaliador1,
      title: dados.tituloAvaliador1,
      type: defenseFind.get('evaluator1Type')
    },
    {
      name: dados.avaliador2,
      title: dados.tituloAvaliador2,
      type: defenseFind.get('evaluator2Type')
    },
    {
      name: dados.avaliador3,
      title: dados.tituloAvaliador3,
      type: defenseFind.get('evaluator3Type')
    }
  ]
  const externalEvaluators = evaluators.filter(
    evaluator => evaluator.type === 'external'
  )
  let usedPage = false
  const pageLayout = files === 'cd' ? 'landscape' : 'portrait'
  const doc = new PDFDocument({
    margin: 20,
    layout: pageLayout,
    size: [595, 841]
  })
  const allFiles = files === undefined
  if (allFiles || files === 'ata') {
    Ata(doc, dados)
    usedPage = true
  }
  if (allFiles && usedPage) {
    doc.addPage({
      margin: 20,
      layout: 'landscape',
      size: [595, 841]
    })
  }
  if (allFiles || files === 'cd') {
    Cd(doc, dados)
    usedPage = true
  }
  if (allFiles && usedPage) {
    doc.addPage()
    usedPage = false
  }
  if (files !== undefined && files.startsWith('certificado')) {
    const index = +files.slice(-1)
    if (people[index - 1].name === null) {
      ctx.status = 404
      ctx.body = { code: errors.NOT_FOUND }
      return
    }
    dados.tituloPessoa = people[index - 1].title
    dados.pessoa = people[index - 1].name
    dados.condicao = people[index - 1].condition
    dados.isDiscente = people[index - 1].isDiscente
    Certificado(doc, dados)
  }
  for (let i = 1; i <= validPeople.length; i++) {
    if (allFiles) {
      dados.tituloPessoa = validPeople[i - 1].title
      dados.pessoa = validPeople[i - 1].name
      dados.condicao = validPeople[i - 1].condition
      dados.isDiscente = validPeople[i - 1].isDiscente
      Certificado(doc, dados)
      usedPage = true
    }
    if (allFiles && usedPage) {
      doc.addPage()
      usedPage = false
    }
  }
  if (files !== undefined && files.startsWith('credenciamento')) {
    const index = +files.slice(-1)
    if (evaluators[index - 1].type !== 'external') {
      ctx.status = 404
      ctx.body = { code: errors.NOT_FOUND }
      return
    }
    dados.membroConvidado = evaluators[index - 1].name
    Credenciamento(doc, dados)
  }
  for (let i = 1; i <= externalEvaluators.length; i++) {
    if (allFiles) {
      dados.membroConvidado = externalEvaluators[i - 1].name
      Credenciamento(doc, dados)
      usedPage = true
    }
    if (allFiles && usedPage) {
      doc.addPage()
      usedPage = false
    }
  }
  if (allFiles || files === 'divulgacao') {
    Divulgacao(doc, dados)
  }
  const title = `${dados.discente.toLowerCase()}${
    files ? `-${files}` : ''
  }.pdf`.replace(/ /g, '-')
  doc.info.Title = title
  await doc.end()
  ctx.status = 200
  ctx.set('Content-Type', 'application/pdf')
  ctx.set('Content-Disposition', `filename=${title}`)
  ctx.body = doc
}
