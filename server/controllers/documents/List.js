const Documents = require('../../models/Document')
const Students = require('../../models/Student')
const errors = require('../../../shared/errors')

module.exports = async function listDocuments(ctx) {
  const { studentId } = ctx.params
  if ((await Students.where('id', studentId).count()) === 0) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }
  ctx.body = await Documents.where({ studentId }).fetchAll()
}
