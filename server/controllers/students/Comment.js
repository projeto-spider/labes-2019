const Student = require('../../models/Student')

module.exports = function commentStudent(ctx) {
  const studentId = ctx.request.body.comment.studentId
  const comment = ctx.request.body.comment.text
  new Student({ id: studentId }).save({ comments: comment }, { patch: true })
  ctx.status = 201
}
