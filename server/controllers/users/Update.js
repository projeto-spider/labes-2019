const User = require('../../models/User')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

module.exports = async function updateUser(ctx) {
  {
    const { valid, invalidParams } = utils.validatePayload(ctx.request.body, [
      'password',
      'username'
    ])
    if (!valid) {
      ctx.status = 400
      ctx.body = { code: errors.INVALID_BODY, invalidParams }
      return
    }
  }
  {
    const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])
    if (!valid) {
      ctx.status = 400
      ctx.body = { code: errors.INVALID_QUERY, invalidParams }
      return
    }
  }
  const { id } = ctx.params
  {
    const { user } = ctx.state.user
    if (user === null || (user.role !== 'admin' && Number(id) !== user.id)) {
      ctx.status = 403
      ctx.body = { code: errors.FORBIDDEN }
      return
    }
  }
  const payload = ctx.request.body

  const user = await User.where({ id }).fetch()
  if (user === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  await user.save(payload)
  ctx.body = user
}
