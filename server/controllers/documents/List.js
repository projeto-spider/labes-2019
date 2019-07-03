const Documents = require('../../models/Document')
const Students = require('../../models/Student')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

module.exports = async function listDocuments(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])
  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }
  const { studentId } = ctx.params
  if ((await Students.where('id', studentId).count()) === 0) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }
  ctx.body = await Documents.where({ studentId }).fetchAll()
}
