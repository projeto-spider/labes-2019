const Setting = require('../../models/Setting')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

module.exports = async function showSetting(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])
  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }
  const { key } = ctx.params
  ctx.body = await Setting.where({ key }).fetch()
}
