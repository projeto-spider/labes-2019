const errors = require('../../../shared/errors')
const utils = require('../../utils')

const Defense = require('../../models/Defense')
const Student = require('../../models/Student')

module.exports = async function removeDefense(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])
  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }
  const { id } = ctx.params

  const defense = await Defense.forge({ id }).fetch()

  if (!defense) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  if (defense.get('status') === 'done') {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
    return
  }

  await Promise.all([
    defense.destroy(),
    Student.where({ defenseId: defense.get('id') }).save(
      { defenseId: null },
      { patch: true, require: false }
    )
  ])

  ctx.status = 204
  ctx.body = {}
}
