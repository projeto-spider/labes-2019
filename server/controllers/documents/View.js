const fs = require('fs')
const path = require('path')
const errors = require('../../../shared/errors')
const enums = require('../../../shared/enums')

const Documents = require('../../models/Document')
const Students = require('../../models/Student')

module.exports = async function viewDocument(ctx) {
  const { studentId, id } = ctx.params

  const studentFind = await Students.where('id', studentId).fetch()

  if (studentFind === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  const documentFind = await Documents.where({ studentId })
    .where({ id })
    .fetch()

  if (documentFind === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
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
      enums.documents[documentFind.get('type')] +
      '.pdf'
  )

  const reader = fs.createReadStream(pathDocument)

  ctx.set('Content-Type', 'application/pdf')
  ctx.set(
    'Content-Disposition',
    'filename="' +
      studentFind.get('registrationNumber') +
      '-' +
      enums.documents[documentFind.get('type')] +
      '.pdf"'
  )
  ctx.status = 200
  ctx.body = reader
}
