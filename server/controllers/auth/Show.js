const utils = require('../../../server/utils')
const errors = require('../../../shared/errors')

module.exports = function showAuth(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])

  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }

  const { user } = ctx.state.user
  ctx.body = user
}
