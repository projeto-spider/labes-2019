const User = require('../../models/User')
const errors = require('../../../shared/errors')

module.exports = async function updateUser(ctx) {
  const { id } = ctx.params
  {
    const { user } = ctx.state.user
    if (user === null || (user.role !== 'admin' && id !== user.id.toString())) {
      ctx.status = 403
      ctx.body = { code: errors.FORBIDDEN }
      return
    }
  }
  const payload = ctx.request.body

  const validRequest = [payload.password, id].every(item => item !== undefined)
  if (!validRequest) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
    return
  }

  const user = await User.where({ id }).fetch()
  if (user === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  await user.save(payload)
  ctx.body = user
}
