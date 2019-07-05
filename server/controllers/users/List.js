const User = require('../../models/User')
const utils = require('../../utils')
const errors = require('../../../shared/errors')

module.exports = async function listUsers(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [
    'page',
    'username'
  ])

  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }
  const { page = 1, username } = ctx.request.query
  let query = User
  if (username !== undefined) {
    query = query.where('username', 'like', username)
  }
  utils.paginateContext(ctx, await query.fetchPage({ page }))
}
