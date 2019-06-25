const Defense = require('../../models/Defense')
const errors = require('../../../shared/errors')

module.exports = async function updateDefense(ctx) {
  const { id } = ctx.params
  const payload = ctx.request.body

  if (id === undefined) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
    return
  }

  const defense = await Defense.where({ id }).fetch()
  if (defense === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  await defense.save(payload)
  ctx.body = defense
}
