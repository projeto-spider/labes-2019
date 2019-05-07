const Student = require('../../models/Student')

module.exports = async function listStudents(ctx) {
  const { page = 1 } = ctx.request.query
  ctx.body = await Student.fetchPage({ page })
}
