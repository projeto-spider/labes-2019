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

  const newStudent = (await Student.where('id', studentId).fetch()).toJSON()
  Object.keys(reqStudent).map(key => (newStudent[key] = reqStudent[key]))

  await new Student({ id: studentId }).save(newStudent, { patch: true })
  ctx.status = 201
  ctx.body = newStudent
}
