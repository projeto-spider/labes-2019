const Subject = require('../../models/Subject')
const errors = require('../../../shared/errors')

module.exports = async function destroySubject(ctx) {
  const { id } = ctx.params

  const studentFind = await Subject.where('id', id).fetch()
  if (studentFind === null) {
    ctx.status = 204
    ctx.body = { code: errors.NOT_FOUND }
    return
  }
  ctx.body = await Subject.where({ id }).destroy()
}
