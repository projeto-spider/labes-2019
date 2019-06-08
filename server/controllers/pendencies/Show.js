const errors = require('../../../shared/errors')

const Students = require('../../models/Student')
const Pendencies = require('../../models/Pendency')
const Subjects = require('../../models/Subject')

module.exports = async function showPendency(ctx) {
  const { studentId, id } = ctx.params

  if ((await Students.where('id', studentId).count()) === 0) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  if (
    (await Pendencies.where({ studentId, subjectId: id }).count()) === 0 ||
    (await Subjects.where({ id }).count()) === 0
  ) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  ctx.body = await Subjects.where({ id }).fetch()
}
