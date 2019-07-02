const User = require('../../models/User')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

module.exports = async function login(ctx) {
  const body = utils.validatePayload(ctx.request.body, ['username', 'password'])
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

  const { username, password } = ctx.request.body

  if (username === undefined || password === undefined) {
    ctx.status = 400
    ctx.body = { code: errors.MISSING_PARAM }
    return
  }

  const user = await User.where('username', username).fetch()

  if (!user) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_CREDENTIALS }
    return
  }

  try {
    await user.authenticate(password)
  } catch (err) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_CREDENTIALS }
    return
  }

  const token = utils.signToken(user.toJSON())

  ctx.body = { token, user }
}
