const Defense = require('../../models/Defense')
const utils = require('../../utils')
const errors = require('../../../shared/errors')

module.exports = async function showDefense(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])
  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }

  const { id } = ctx.params

  const defense = await Defense.where({ id }).fetch()

  if (defense === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }
  ctx.body = defense
}
