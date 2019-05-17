const Student = require('../../models/Student')
const errors = require('../../../shared/errors')

module.exports = async function commentStudent(ctx) {
  const studentId = ctx.request.body.student.id
  const reqStudent = ctx.request.body.student

  if ((await Student.where('id', studentId).count()) !== 1) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND_ROUTE, param: 'studentId' }
    return
  }

  await new Student({ id: studentId }).save(reqStudent, { patch: true })
  ctx.status = 201
  ctx.body = reqStudent
}
