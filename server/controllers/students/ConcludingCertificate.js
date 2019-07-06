const PDFDocument = require('pdfkit')
const Student = require('../../models/Student')
const Defense = require('../../models/Defense')
const utils = require('../../utils')
const errors = require('../../../shared/errors')
const CertificadoConlusao = require('../../models/tccdocs/certificadoConclusao')

const month = {
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

module.exports = async function generateConcludingCertificate(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])
  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }
  const { id } = ctx.params
  const studentFind = await Student.where({ id }).fetch()
  if (studentFind === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }
  const defenseId = studentFind.get('defenseId')
  const defenseFind = await Defense.where('id', defenseId).fetch()
  if (defenseFind === null || defenseFind.get('status') !== 'done') {
    ctx.status = 422
    ctx.body = { code: errors.UNPROCESSABLE_ENTITY }
    return
  }
  const today = new Date()
  const data = {
    dia: today.getUTCDate(),
    mes: month[today.getUTCMonth()],
    ano: today.getUTCFullYear(),
    curso: studentFind.get('course'),
    discente: studentFind.get('name')
  }
  const doc = new PDFDocument({
    layout: 'landscape',
    size: [595, 841]
  })
  CertificadoConlusao(doc, data)
  await doc.end()
  const title = `${data.discente}-certificado-conclusao.pdf`
  ctx.status = 200
  ctx.set('Content-Type', 'application/pdf')
  ctx.set('Content-Disposition', `filename=${title}`)
  ctx.body = doc
}
