const errors = require('../../../shared/errors')

const Students = require('../../models/Student')
const Pendencies = require('../../models/Pendency')

module.exports = async function listPendencies(ctx) {
  const { studentId } = ctx.params

  if ((await Students.where('id', studentId).count()) === 0) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  ctx.body = await Pendencies.where({ studentId }).fetchAll()
}
