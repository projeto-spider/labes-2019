const Student = require('../../models/Student')
const utils = require('../../utils')
const errors = require('../../../shared/errors')

module.exports = async function showStudent(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])
  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }
  const { id } = ctx.params
  ctx.body = await Student.where({ id }).fetch()
}
