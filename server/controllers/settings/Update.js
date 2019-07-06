const Setting = require('../../models/Setting')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

module.exports = async function updateSetting(ctx) {
  {
    const { valid, invalidParams } = utils.validatePayload(ctx.request.body, [
      'value'
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

  const { key } = ctx.params
  const { value } = ctx.request.body

  if (value === undefined) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
    return
  }

  const found = await Setting.where({ key }).fetch()
  const setting = found || (await Setting.forge({ key, value }).save())

  if (found) {
    await setting.save({ value })
  }

  ctx.body = setting
}
