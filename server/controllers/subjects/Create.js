const Subject = require('../../models/Subject')
const errors = require('../../../shared/errors')

module.exports = async function createSubject(ctx) {
  const { name } = ctx.request.body

  const validRequest = [name].every(item => item !== undefined)
  if (!validRequest) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
    return
  }

  ctx.status = 201
  ctx.body = await Subject.forge({ name }).save()
}
