const Student = require('../../models/Student')

module.exports = async function showStudent(ctx) {
  const { id } = ctx.params
  ctx.body = await Student.where({ id }).fetch()
}
