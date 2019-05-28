const Student = require('../../models/Student')

module.exports = async function activesMail(ctx) {
  ctx.body = {
    mailingList: (await Student.where('isActive', true)
      .where('email', 'like', '%@gmail.com%')
      .fetchAll())
      .toJSON()
      .map(aluno => aluno.email)
      .join(', ')
  }
}
