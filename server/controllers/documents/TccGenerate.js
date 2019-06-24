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
  dados.curso = studentFind.get('course')
  dados.tituloTCC = 'T.T'
  dados.nomeDosAlunos = studentFind.get('name')
  dados.tituloOrientador = 'T.O'
  dados.orientador = studentFind.get('advisor')
  dados.tituloCoOrientador = 'T.C.O'
  dados.coOrientador = 'C.O'
  // como vai ser esse defenseDate?
  dados.diaDefesa = studentFind.get('defenseDate')
  dados.mesDefesa = studentFind.get('defenseDate')
  dados.anoDefesa = studentFind.get('defenseDate')
  dados.tituloAvaliador1 = 'T.A.1'
  dados.avaliador1 = 'A.1'
  dados.tituloAvaliador2 = 'T.A.2'
  dados.avaliador2 = 'A.2'
  dados.tituloAvaliador3 = 'T.A.3'
  dados.avaliador3 = 'A.3'
  const date = new Date()
  dados.dia = date.getUTCDate()
  dados.mes = date.getUTCMonth()
  dados.ano = date.getUTCFullYear()
  dados.tituloDiretor = 'T.D'
  dados.diretor = 'D'
  dados.matricula = studentFind.get('registrationNumber')
  dados.membroConvidado = 'M.C'
  dados.discente = studentFind.get('name')
  dados.palavrasChave = 'Keywords'
  dados.horarioDefesa = 'H.D'
  dados.salaDefesa = 'S.D'
  dados.resumo = 'R'
  dados.tituloPessoa = 'T.P'
  dados.condicao = 'C'

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
