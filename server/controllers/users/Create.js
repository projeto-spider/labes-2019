const User = require('../../models/User')
const errors = require('../../../shared/errors')

module.exports = async function createUser(ctx) {
  const { email, username, password, role } = ctx.request.body

  const validRequest = [email, username, password, role].every(
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
  ctx.body = await User.forge({ email, username, password, role }).save()
}
