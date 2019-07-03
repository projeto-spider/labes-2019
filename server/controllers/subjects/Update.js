const Subject = require('../../models/Subject')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

module.exports = async function updateSubject(ctx) {
  {
    const { valid, invalidParams } = utils.validatePayload(ctx.request.body, [
      'name'
    ])
    if (!valid) {
      ctx.status = 400
      ctx.body = { code: errors.INVALID_BODY, invalidParams }
      return
    }
  }
  {
    const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])
    if (!valid) {
      ctx.status = 400
      ctx.body = { code: errors.INVALID_QUERY, invalidParams }
      return
    }
  }
  const { id } = ctx.params
  const subjectUpdate = ctx.request.body

  if (id === undefined || subjectUpdate.name === undefined) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
    return
  }

  const subjectFind = await Subject.where({ id }).fetch()
  if (subjectFind === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  const duplicate = !!(await Subject.where({
    name: subjectUpdate.name
  })
    .where('id', '<>', id)
    .count())

  if (duplicate) {
    ctx.status = 422
    ctx.body = { code: errors.UNPROCESSABLE_ENTITY }
    return
  }

  await subjectFind.save(subjectUpdate)
  ctx.body = subjectFind
}
