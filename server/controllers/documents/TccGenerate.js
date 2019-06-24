const PDFDocument = require('pdfkit')

const errors = require('../../../shared/errors')

const Students = require('../../models/Student')

const Cd = require('../../models/tccdocs/cd')
const Ata = require('../../models/tccdocs/ata')
const Certificado = require('../../models/tccdocs/certificado')
const Credenciamento = require('../../models/tccdocs/credenciamento')
const Divulgacao = require('../../models/tccdocs/divulgacao')

module.exports = async function generateAllDocs(ctx) {
  const { studentId } = ctx.params

  const studentFind = await Students.where('id', studentId).fetch()

  if (studentFind === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

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
  // FILL ALL DATA

  let doc = new PDFDocument()
  doc = Ata(doc, dados)
  doc = Cd(doc, dados)
  doc.addPage()
  doc = Certificado(doc, dados)
  doc.addPage()
  doc = Credenciamento(doc, dados)
  doc.addPage()
  doc = Divulgacao(doc, dados)
  doc.end()

  ctx.status = 200
  ctx.body = doc
}
