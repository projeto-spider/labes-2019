const PDFDocument = require('pdfkit')

const Defense = require('../../models/Defense')

const Cd = require('../../models/tccdocs/cd')
const Ata = require('../../models/tccdocs/ata')
const Certificado = require('../../models/tccdocs/certificado')
const Credenciamento = require('../../models/tccdocs/credenciamento')
const Divulgacao = require('../../models/tccdocs/divulgacao')

module.exports = async function generateAllDocs(ctx) {
  const { id, files } = ctx.params
  const defenseFind = await Defense.where('id', id).fetch()

  const dados = {
    curso: 'curso',
    tituloTCC: 'titulotcc',
    nomeDosAlunos: 'nome dos alunos',
    tituloOrientador: 'tituloorientador',
    orientador: 'orientador',
    tituloCoOrientador: 'titulocoorientador',
    coOrientador: 'coorientador',
    diaDefesa: 'diadefesa',
    mesDefesa: 'mesdefesa',
    anoDefesa: 'anodefesa',
    tituloAvaliador1: 'tituloavaliador1',
    avaliador1: 'avaliador1',
    tituloAvaliador2: 'tituloavaliador2',
    avaliador2: 'avaliador2',
    tituloAvaliador3: 'tituloavaliador3',
    avaliador3: 'avaliador3',
    dia: 'dia',
    mes: 'mes',
    ano: 'ano',
    tituloDiretor: 'titulodiretor',
    diretor: 'diretor',
    matricula: 'matricula',
    membroConvidado: 'membro convidado',
    discente: 'discente',
    palavrasChave: 'palavras chave',
    horarioDefesa: 'horariodefesa',
    salaDefesa: 'saladefesa',
    resumo: 'resumo',
    pessoa: 'pessoa',
    tituloPessoa: 'titulopessoa',
    condicao: 'condicao'
  }

  const translations = {
    cbcc: 'Ciência da Computação',
    cbsi: 'Sistemas de Informação',
    doctor: 'Dr',
    master: 'Me',
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

  dados.curso = translations[defenseFind.get('course')]
  dados.tituloTCC = defenseFind.get('title')
  dados.nomeDosAlunos = defenseFind.get('students').replace(', ', '\n')
  dados.tituloOrientador = translations[defenseFind.get('advisorTitle')]
  dados.orientador = defenseFind.get('advisorName')
  dados.tituloCoOrientador = translations[defenseFind.get('coAdvisorTitle')]
  dados.coOrientador = defenseFind.get('coAdvisorName')
  dados.diaDefesa = defenseFind.get('date').split('/')[0]
  dados.mesDefesa = translations[Number(defenseFind.get('date').split('/')[1])]
  dados.anoDefesa = defenseFind.get('date').split('/')[2]
  dados.tituloAvaliador1 = translations[defenseFind.get('evaluator1Title')]
  dados.avaliador1 = defenseFind.get('evaluator1Name')
  dados.tituloAvaliador2 = translations[defenseFind.get('evaluator2Title')]
  dados.avaliador2 = defenseFind.get('evaluator2Name')
  dados.tituloAvaliador3 = translations[defenseFind.get('evaluator3Title')]
  dados.avaliador3 = defenseFind.get('evaluator3Name')
  dados.dia = date.getUTCDate()
  dados.mes = translations[date.getUTCMonth()]
  dados.ano = date.getUTCFullYear()
  dados.tituloDiretor = 'Josivaldo de Souza Araújo'
  dados.diretor = translations.doctor
  dados.matricula = defenseFind.get('registrationNumbers')
  dados.discente = defenseFind.get('students').split(', ')[0]
  dados.palavrasChave = defenseFind.get('keywords')
  dados.horarioDefesa = defenseFind.get('time').slice(0, -2)
  dados.salaDefesa = defenseFind.get('local')
  dados.resumo = defenseFind.get('summary')

  dados.tituloPessoa = 'FODA-SE'
  dados.condicao = 'FODA-C'

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
  const doc = new PDFDocument()
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
  if (allFiles || files === 'certificado') {
    Certificado(doc, dados)
    usedPage = true
  }
  if (allFiles && usedPage) {
    doc.addPage()
    usedPage = false
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
  doc.end()

  ctx.status = 200
  ctx.body = doc
}
