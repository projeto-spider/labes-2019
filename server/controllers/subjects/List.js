const Subject = require('../../models/Subject')
const utils = require('../../utils')

module.exports = async function listSubjects(ctx) {
  const { page = 1 } = ctx.request.query
  utils.paginateContext(ctx, await Subject.fetchPage({ page }))
}
