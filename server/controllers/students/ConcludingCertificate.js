const PDFDocument = require('pdfkit')
const Student = require('../../models/Student')
const Defense = require('../../models/Defense')
const Settings = require('../../models/Setting')
const utils = require('../../utils')
const errors = require('../../../shared/errors')
const CertificadoConlusao = require('../../models/tccdocs/certificadoConclusao')

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
  if (defenseFind === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }
  if (defenseFind.get('status') !== 'done') {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
    return
  }
  const today = new Date()
  today.setHours(today.getHours() - 3)
  const data = {
    dia: today.getUTCDate(),
    mes: utils.translate(today.getUTCMonth() + 1),
    ano: today.getUTCFullYear(),
    curso:
      studentFind.get('course') === 'cbcc'
        ? 'Ciência da Computação'
        : 'Sistemas de Informação',
    discente: studentFind.get('name'),
    tituloDiretorInstituto: 'Prof(a). ',
    diretorInstituto: 'NÃO ENCONTRADO NAS CONFIGURAÇÕES!',
    tituloDiretor: 'Prof(a). ',
    diretor: 'NÃO ENCONTRADO NAS CONFIGURAÇÕES!'
  }
  const findFacompDirector = await Settings.where(
    'key',
    'facultyDirectorName'
  ).fetch()
  if (findFacompDirector) data.diretor = findFacompDirector.get('value')
  const findIcenDirector = await Settings.where(
    'key',
    'departamentDirector'
  ).fetch()
  if (findIcenDirector) data.diretorInstituto = findIcenDirector.get('value')
  const doc = new PDFDocument({
    layout: 'landscape',
    size: [595, 841]
  })
  CertificadoConlusao(doc, data)
  const title = `${data.discente}-certificado-conclusao.pdf`
    .replace(' ', '-')
    .toLocaleLowerCase()
  doc.info.Title = title
  await doc.end()
  ctx.status = 200
  ctx.set('Content-Type', 'application/pdf')
  ctx.set('Content-Disposition', `filename=${title}`)
  ctx.body = doc
}
