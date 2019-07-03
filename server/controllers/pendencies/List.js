const errors = require('../../../shared/errors')
const utils = require('../../utils')

const Students = require('../../models/Student')
const Pendencies = require('../../models/Pendency')

module.exports = async function listPendencies(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])
  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }
  const { studentId } = ctx.params

  if ((await Students.where('id', studentId).count()) === 0) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  ctx.body = await Pendencies.where({ studentId }).fetchAll()
}
