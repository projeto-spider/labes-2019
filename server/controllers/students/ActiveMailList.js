const Student = require('../../models/Student')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

module.exports = async function activesMail(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])
  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }
  ctx.body = {
    mailingList: (await Student.where('isActive', true)
      .where('email', 'like', '%@gmail.com%')
      .fetchAll())
      .toJSON()
      .map(aluno => aluno.email)
      .join(', ')
  }
}
