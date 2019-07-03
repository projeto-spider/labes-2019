const User = require('../../models/User')
const utils = require('../../utils')
const errors = require('../../../shared/errors')

module.exports = async function listUsers(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [
    'page'
  ])

  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }

  const { page = 1 } = ctx.request.query
  utils.paginateContext(ctx, await User.fetchPage({ page }))
}
