const Subject = require('../../models/Subject')
const errors = require('../../../shared/errors')

module.exports = async function updateSubject(ctx) {
  const { id } = ctx.params
  const subjectUpdate = ctx.request.body

  if (id === undefined) {
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

  await subjectFind.save(subjectUpdate)
  ctx.body = subjectFind
}
