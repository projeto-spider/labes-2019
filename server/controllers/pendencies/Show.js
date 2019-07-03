const errors = require('../../../shared/errors')
const utils = require('../../utils')

const Students = require('../../models/Student')
const Pendencies = require('../../models/Pendency')

module.exports = async function showPendency(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])
  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }

  const { studentId, id } = ctx.params

  if ((await Students.where('id', studentId).count()) === 0) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  const pendencyFind = await Pendencies.where({ id }).fetch()

  if (pendencyFind === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  ctx.body = pendencyFind
}
