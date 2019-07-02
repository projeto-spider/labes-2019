const User = require('../../models/User')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

module.exports = async function listUsers(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])

  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }

  const { id } = ctx.params
  ctx.body = await User.where({ id }).fetch()
}
