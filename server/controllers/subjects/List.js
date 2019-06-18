const Subject = require('../../models/Subject')
const utils = require('../../utils')

module.exports = async function listSubjects(ctx) {
  const { page = 1, paginate } = ctx.request.query
  if (paginate !== undefined && paginate === '0') {
    ctx.body = await Subject.fetchAll()
    return
  }
  utils.paginateContext(ctx, await Subject.fetchPage({ page }))
}
