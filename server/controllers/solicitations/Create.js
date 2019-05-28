const Solicitation = require('../../models/Solicitation.js')
const errors = require('../../../shared/errors')

module.exports = async function createUser(ctx) {
  const { name, email, registrationNumber, type } = ctx.request.body

  const validRequest = [name, email, type].every(item => item !== undefined)
  if (!validRequest) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
    return
  }

  const duplicateEmail = !!(await Solicitation.where({ email }).count())

  if (
    registrationNumber !== undefined &&
    (duplicateEmail || registrationNumber.length !== 12)
  ) {
    ctx.status = 422
    ctx.body = { code: errors.UNPROCESSABLE_ENTITY }
    return
  }

  ctx.status = 201
  ctx.body = await Solicitation.forge({
    name,
    email,
    registrationNumber,
    type
  }).save()
}
