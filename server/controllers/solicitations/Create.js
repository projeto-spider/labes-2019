const Solicitation = require('../../models/Solicitation.js')
const errors = require('../../../shared/errors')

module.exports = async function createUser(ctx) {
  const { name, email, registrationNumber = '' } = ctx.request.body

  const validRequest = [name, email, registrationNumber].every(
    item => item !== undefined
  )
  if (!validRequest) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
    return
  }

  const duplicateEmail = !!(await Solicitation.where({ email }).count())

  if (
    duplicateEmail ||
    (registrationNumber.length !== 12 && registrationNumber !== '')
  ) {
    ctx.status = 422
    ctx.body = { code: errors.UNPROCESSABLE_ENTITY }
    return
  }

  ctx.status = 201
  ctx.body = await Solicitation.forge({
    name,
    email,
    registrationNumber
  }).save()
}
