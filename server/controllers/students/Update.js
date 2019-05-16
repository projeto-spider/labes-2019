const Student = require('../../models/Student')
const errors = require('../../../shared/errors')

module.exports = async function showStudent(ctx) {
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
  } else {
    try {
      await studentFind.save(studentUpdate)
    } catch (err) {
      ctx.status = 400
      ctx.body = err
      return
    }
  }

  ctx.body = studentFind
}
