const Subject = require('../../models/Subject')
const utils = require('../../utils')
const errors = require('../../../shared/errors')

module.exports = async function listSubjects(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [
    'page',
    'paginate'
  ])
  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }
  const { page = 1, paginate } = ctx.request.query
  if (paginate === 'false') {
    ctx.body = await Subject.fetchAll()
    return
  }
  utils.paginateContext(ctx, await Subject.fetchPage({ page }))
}
