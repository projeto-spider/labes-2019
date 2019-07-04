const Solicitation = require('../../models/Solicitation.js')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

module.exports = async function createSolicitation(ctx) {
  {
    const { valid, invalidParams } = utils.validatePayload(ctx.request.body, [
      'name',
      'email',
      'registrationNumber',
      'type',
      'course',
      'admissionType'
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

  const {
    name,
    email,
    registrationNumber,
    type,
    course,
    admissionType
  } = ctx.request.body

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
    type,
    course,
    admissionType
  }).save()
}
