const Student = require('../../models/Student')
const errors = require('../../../shared/errors')

module.exports = async function updateStudent(ctx) {
  const studentUpdate = ctx.request.body

  if (studentUpdate.id === undefined) {
    ctx.status = 404
    ctx.body = { code: errors.STUDENT_NOT_FOUND }
    return
  }

  const studentFind = await Student.where('id', studentUpdate.id).fetch()
  if (studentFind === null) {
    ctx.status = 404
    ctx.body = { code: errors.STUDENT_NOT_FOUND }
    return
  }

  await studentFind.save(studentUpdate)
  ctx.body = studentFind
}
