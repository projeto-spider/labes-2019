const User = require('../../models/User')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

module.exports = async function createUser(ctx) {
  const body = utils.validatePayload(ctx.request.body, [
    'email',
    'username',
    'fullName',
    'password',
    'role'
  ])

  if (!body.valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_BODY, invalidParams: body.invalidParams }
    return
  }

  const query = utils.validateQuery(ctx.request.query, [])

  if (!query.valid) {
    ctx.status = 400
    ctx.body = {
      code: errors.INVALID_QUERY,
      invalidParams: query.invalidParams
    }
    return
  }

  const { email, username, fullName, password, role } = ctx.request.body

  const validRequest = [email, username, fullName, password, role].every(
    item => item !== undefined
  )
  if (!validRequest) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
    return
  }

  const duplicateEmail = !!(await User.where({ email }).count())
  const duplicateUsername = !!(await User.where({ username }).count())

  if (duplicateEmail || duplicateUsername) {
    ctx.status = 422
    ctx.body = { code: errors.UNPROCESSABLE_ENTITY }
    return
  }

  ctx.status = 201
  ctx.body = await User.forge({
    email,
    username,
    fullName,
    password,
    role
  }).save()
}
