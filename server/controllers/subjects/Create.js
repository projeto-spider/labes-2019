const Subject = require('../../models/Subject')
const errors = require('../../../shared/errors')

module.exports = async function createSubject(ctx) {
  const { name, code } = ctx.request.body

  const validRequest = [name, code].every(item => item !== undefined)
  if (!validRequest) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
    return
  }

  const duplicateCode = !!(await Subject.where({ code }).count())

  if (duplicateCode) {
    ctx.status = 422
    ctx.body = {
      code: errors.UNPROCESSABLE_ENTITY,
      prop: 'code'
    }
    return
  }

  ctx.status = 201
  ctx.body = await Subject.forge({ name, code }).save()
}
