module.exports = function showAuth(ctx) {
  const { user } = ctx.state.user
  ctx.body = user
}
