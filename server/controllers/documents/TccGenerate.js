const PDFDocument = require('pdfkit')
const errors = require('../../../shared/errors')
const Defense = require('../../models/Defense')
const Cd = require('../../models/tccdocs/cd')
const Ata = require('../../models/tccdocs/ata')
const Certificado = require('../../models/tccdocs/certificado')
const Credenciamento = require('../../models/tccdocs/credenciamento')
const Divulgacao = require('../../models/tccdocs/divulgacao')

module.exports = async function generateAllDocs(ctx) {
  const { id, files } = ctx.params
  const defenseFind = await Defense.where('id', id).fetch()
  if (defenseFind === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }
  const translations = {
    cbcc: 'Ciência da Computação',
    cbsi: 'Sistemas de Informação',
    doctor: 'Dr(a). ',
    master: 'Me(a). ',
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
  const date = new Date()
  const dados = {
    curso: translations[defenseFind.get('course')],
    tituloTCC: defenseFind.get('title'),
    nomeDosAlunos: defenseFind.get('students').replace(/, /g, '\n'),
    tituloOrientador: translations[defenseFind.get('advisorTitle')],
    orientador: defenseFind.get('advisorName'),
    tituloCoOrientador: translations[defenseFind.get('coAdvisorTitle')],
    coOrientador: defenseFind.get('coAdvisorName'),
    tituloAvaliador1: translations[defenseFind.get('evaluator1Title')],
    avaliador1: defenseFind.get('evaluator1Name'),
    tituloAvaliador2: translations[defenseFind.get('evaluator2Title')],
    avaliador2: defenseFind.get('evaluator2Name'),
    tituloAvaliador3: translations[defenseFind.get('evaluator3Title')],
    avaliador3: defenseFind.get('evaluator3Name'),
    diaDefesa: defenseFind.get('date').split('/')[0],
    mesDefesa: translations[Number(defenseFind.get('date').split('/')[1])],
    anoDefesa: defenseFind.get('date').split('/')[2],
    dia: date.getUTCDate(),
    mes: translations[date.getUTCMonth()],
    ano: date.getUTCFullYear(),
    tituloDiretor: translations.doctor,
    diretor: 'Josivaldo de Souza Araújo',
    matricula: defenseFind.get('registrationNumbers').split(', ')[0],
    discente: defenseFind.get('students').split(', ')[0],
    palavrasChave: defenseFind.get('keywords'),
    horarioDefesa: defenseFind.get('time').slice(0, -3),
    salaDefesa: defenseFind.get('local'),
    resumo: defenseFind.get('summary'),
    trechoAv3: '',
    trechoCoorientador: '',
    isDiscente: false
  }
  if (dados.avaliador3) {
    dados.trechoAv3 = `, ${dados.tituloAvaliador3}${
      dados.avaliador3
    } (AVALIADOR(A))`
  }
  if (dados.coOrientador) {
    dados.trechoCoorientador = `, ${dados.tituloCoOrientador}${
      dados.coOrientador
    } (COORIENTADOR(A))`
  }
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
  const doc = new PDFDocument({
    margin: 20,
    size: [595, 841]
  })
  const allFiles = files === undefined
  if (allFiles || files === 'ata') {
    Ata(doc, dados)
    usedPage = true
  }
  if (allFiles || files === 'cd') {
    Cd(doc, dados)
    usedPage = true
  }
  if (allFiles && usedPage) {
    doc.addPage()
    usedPage = false
  }
  for (let i = 1; i <= validPeople.length; i++) {
    if (allFiles || files === `certificado${i}`) {
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
  for (let i = 1; i <= externalEvaluators.length; i++) {
    if (allFiles || files === `credenciamento${i}`) {
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
  const filename = files
    ? `${dados.discente.toLowerCase()}-${files}`
    : `${dados.discente.toLowerCase()}`
  doc.end()
  ctx.status = 200
  ctx.type = 'application/pdf'
  ctx.set(
    'Content-Disposition',
    `inline; filename=${filename.replace(/ /g, '-')}.pdf`
  )
  ctx.body = doc
}
