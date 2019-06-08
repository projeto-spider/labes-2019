const errors = require('../../../shared/errors')

const Students = require('../../models/Student')
const Pendencies = require('../../models/Pendency')
const Subjects = require('../../models/Subject')

module.exports = async function listPendencies(ctx) {
  const { studentId } = ctx.params

  if ((await Students.where('id', studentId).count()) === 0) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  if ((await Pendencies.where({ studentId }).count()) === 0) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  const subjectsIds = await Pendencies.where({ studentId })
    .fetchAll()
    .then(collection => collection.map(pendency => pendency.get('subjectId')))

  ctx.body = await Subjects.where('id', 'in', subjectsIds).fetchAll()
}
