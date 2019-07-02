const Subject = require('../../models/Subject')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

module.exports = async function createSubject(ctx) {
  {
    const { valid, invalidParams } = utils.validatePayload(ctx.request.body, [
      'name'
    ])
    if (!valid) {
      ctx.status = 400
      ctx.body = { code: errors.INVALID_BODY, invalidParams }
      return
    }
  }
  {
    const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])
    if (!valid) {
      ctx.status = 400
      ctx.body = { code: errors.INVALID_QUERY, invalidParams }
      return
    }
  }
  const { name } = ctx.request.body

  const validRequest = [name].every(item => item !== undefined)
  if (!validRequest) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
    return
  }

  const duplicate = !!(await Subject.where({ name }).count())

  if (duplicate) {
    ctx.status = 422
    ctx.body = { code: errors.UNPROCESSABLE_ENTITY }
    return
  }

  ctx.status = 201
  ctx.body = await Subject.forge({ name }).save()
}
