const User = require('../../models/User')

module.exports = async function listUsers(ctx) {
  const { page = 1 } = ctx.request.query
  ctx.body = await User.fetchPage({ page })
}
