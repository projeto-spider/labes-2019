const Student = require('../../models/Student')
const utils = require('../../utils')
const errors = require('../../../shared/errors')

module.exports = async function updateStudent(ctx) {
  const { id } = ctx.params
  const studentUpdate = ctx.request.body

  if (id === undefined) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
    return
  }

  const studentFind = await Student.where({ id }).fetch()
  if (studentFind === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  await studentFind.save(studentUpdate)

  await utils.updateStudentFitness(studentFind)

  ctx.body = studentFind
}
