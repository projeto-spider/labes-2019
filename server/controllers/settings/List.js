const Setting = require('../../models/Setting')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

module.exports = async function listSettings(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [
    'page'
  ])
  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }
  const { page = 1 } = ctx.request.query
  utils.paginateContext(ctx, await Setting.fetchPage({ page }))
}
