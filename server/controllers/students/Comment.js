const Student = require('../../models/Student')

module.exports = async function commentStudent(ctx) {
  const studentId = ctx.request.body.comment.studentId
  const comment = ctx.request.body.comment.text

  if ((await Student.where('id', studentId).fetch()) === null) {
    ctx.status = 400
    ctx.body = { code: 'INVALID_PARSING', param: 'studentId' }
    return
  }

  new Student({ id: studentId }).save({ comments: comment }, { patch: true })
  ctx.status = 201
}
