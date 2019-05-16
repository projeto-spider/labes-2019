const errors = require('../../../shared/errors')

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

  ctx.body = documentFind
}
