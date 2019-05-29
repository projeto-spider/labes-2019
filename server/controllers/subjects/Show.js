const Subject = require('../../models/Subject')

module.exports = async function showSubject(ctx) {
  const { id } = ctx.params
  ctx.body = await Subject.where({ id }).fetch()
}
