const Student = require('../../models/Student')
const errors = require('../../../shared/errors')

module.exports = async function commentStudent(ctx) {
  const studentId = ctx.request.body.comment.studentId
  const comment = ctx.request.body.comment.text

  if (studentId > (await Student.count())) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND_ROUTE, param: 'studentId' }
    return
  }

  const newStudent = await new Student({ id: studentId }).save(
    { comments: comment },
    { patch: true }
  )
  ctx.status = 201
  ctx.body = newStudent.toJSON()
}
