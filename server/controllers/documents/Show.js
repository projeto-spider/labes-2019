const errors = require('../../../shared/errors')
const utils = require('../../utils')

const Documents = require('../../models/Document')
const Students = require('../../models/Student')

module.exports = async function showDocument(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])
  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }
  const { studentId, id } = ctx.params

  if ((await Students.where('id', studentId).count()) === 0) {
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
