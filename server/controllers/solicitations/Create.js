const Solicitation = require('../../models/Solicitation.js')
const errors = require('../../../shared/errors')

module.exports = async function createUser(ctx) {
  const { reason, name, email, registrationNumber } = ctx.request.body

  const validRequest = [reason, name, email, registrationNumber].every(
    item => item !== undefined
  )
  if (!validRequest) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
    return
  }

  const duplicateEmail = !!(await Solicitation.where({ email }).count())
  //  const registrationNumber1 = !!(await Solicitation.where({ name }).count())

  if (duplicateEmail || registrationNumber.length !== 12) {
    ctx.status = 422
    ctx.body = { code: errors.UNPROCESSABLE_ENTITY }
    return
  }

  ctx.status = 201
  ctx.body = await Solicitation.forge({
    reason,
    name,
    email,
    registrationNumber
  }).save()
}
