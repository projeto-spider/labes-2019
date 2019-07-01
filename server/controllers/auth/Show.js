const utils = require('../../../server/utils')
const errors = require('../../../shared/errors')

module.exports = function showAuth(ctx) {
  const queryValid = utils.keysValid(ctx.request.query, [])

  if (!queryValid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_PARAM }
    return
  }
  const { user } = ctx.state.user
  ctx.body = user
}
