const User = require('../../models/User')

module.exports = async function listUsers(ctx) {
  const { id } = ctx.params
  ctx.body = await User.where({ id }).fetch()
}
