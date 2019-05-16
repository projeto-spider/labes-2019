const fs = require('fs')
const path = require('path')
const errors = require('../../../shared/errors')
const enumi = require('../../../shared/enum')

const Documents = require('../../models/Document')
const Students = require('../../models/Student')

module.exports = async function showDocument(ctx) {
  const { studentID, id } = ctx.params

  const studentFind = await Students.where('id', studentID).fetch()

  if (studentFind === null) {
    ctx.status = 404
    ctx.body = { code: errors.STUDENT_NOT_FOUND }
    return
  }

  const documentFind = await Documents.where({ studentID })
    .where({ id })
    .fetch()

  if (documentFind === null) {
    ctx.status = 404
    ctx.body = { code: errors.DOCUMENT_NOT_FOUND }
    return
  }

  const pathStudent = path.join(
    __dirname,
    '../../../storage/',
    studentFind.get('registrationNumber')
  )

  const pathDocument = path.join(
    pathStudent,
    studentFind.get('registrationNumber') +
      '-' +
      enumi.documents[documentFind.get('type')] +
      '.pdf'
  )

  const reader = fs.createReadStream(pathDocument)

  ctx.set('Content-Type', 'application/pdf')
  ctx.set(
    'Content-Disposition',
    'filename="' +
      studentFind.get('registrationNumber') +
      '-' +
      enumi.documents[documentFind.get('type')] +
      '.pdf"'
  )
  ctx.body = reader
}
