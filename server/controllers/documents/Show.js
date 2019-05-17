const errors = require('../../../shared/errors')

const Documents = require('../../models/Document')
const Students = require('../../models/Student')

module.exports = async function showDocument(ctx) {
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

  ctx.body = documentFind
}
