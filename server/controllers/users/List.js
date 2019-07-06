const User = require('../../models/User')
const utils = require('../../utils')
const errors = require('../../../shared/errors')

module.exports = async function listUsers(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [
    'page',
    'username',
    'paginate'
  ])

  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }
  const { page = 1, username, paginate } = ctx.request.query
  let query = User
  if (username !== undefined) {
    query = query.where('username', 'like', username)
  }
  if (paginate === 'false') {
    ctx.body = await query.fetchAll()
    return
  }
  utils.paginateContext(ctx, await query.fetchPage({ page }))
}
