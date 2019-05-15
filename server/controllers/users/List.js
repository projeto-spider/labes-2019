const User = require('../../models/User')
const utils = require('../../utils')

module.exports = async function listUsers(ctx) {
  const { page = 1 } = ctx.request.query
  utils.paginateContext(ctx, await User.fetchPage({ page }))
}
