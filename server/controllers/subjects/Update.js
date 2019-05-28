const Subject = require('../../models/Subject')
const errors = require('../../../shared/errors')

module.exports = async function updateSubject(ctx) {
  const subjectUpdate = ctx.request.body

  if (subjectUpdate.id === undefined) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  const subjectFind = await Subject.where('id', subjectUpdate.id).fetch()
  if (subjectFind === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  await subjectFind.save(subjectUpdate)
  ctx.body = subjectFind
}
