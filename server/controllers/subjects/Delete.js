const Subject = require('../../models/Subject')

module.exports = async function destroySubject(ctx) {
  const { id } = ctx.params
  ctx.body = await Subject.where({ id }).destroy()
}
