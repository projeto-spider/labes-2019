const errors = require('../../../shared/errors')

const Students = require('../../models/Student')
const Pendencies = require('../../models/Pendency')

module.exports = async function showPendency(ctx) {
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
