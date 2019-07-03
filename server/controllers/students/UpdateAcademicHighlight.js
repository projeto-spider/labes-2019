const Student = require('../../models/Student')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

module.exports = async function updateAcademicHighlight(ctx) {
  {
    const { valid, invalidParams } = utils.validatePayload(ctx.request.body, [
      'id'
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
  const { id } = ctx.request.body

  if (!id) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
    return
  }

  const studentFind = await Student.where('isGraduating', 1)
    .where('isFit', 1)
    .where('isActive', 1)
    .where('id', id)
    .fetch()
  if (studentFind === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  await Student.where({
    isActive: true,
    isGraduating: true,
    isFit: true,
    course: studentFind.get('course')
  }).save({ academicHighlight: false }, { method: 'update', patch: true })

  ctx.body = await studentFind.save({ academicHighlight: true })
}
