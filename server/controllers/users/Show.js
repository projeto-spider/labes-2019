const User = require('../../models/User')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

module.exports = async function listUsers(ctx) {
  const queryValid = utils.keysValid(ctx.request.query, [])

  if (!queryValid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_PARAM }
    return
  }

  const { id } = ctx.params
  ctx.body = await User.where({ id }).fetch()
}
