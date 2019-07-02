const Defense = require('../../models/Defense')
const utils = require('../../utils')
const errors = require('../../../shared/errors')

module.exports = async function listDefenses(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [
    'page',
    'status',
    'course',
    'query'
  ])
  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }

  const { user } = ctx.state.user
  utils.paginateContext(ctx, await filter(ctx.request.query, user))
}
/**
 * Filter defenses 👍
 * @param {object} query - Filter args
 * @param {object} user - User
 * @return {Promise} Bookshelf
 */
function filter(filters, user) {
  const { page = 1, status, course } = filters
  const userId = user.id

  let query = user.role === 'admin' ? Defense : Defense.where({ userId })

  if (status !== undefined) {
    query = query.where('status', status)
  }

  if (course !== undefined) {
    query = query.where('course', course)
  }

  if (filters.query !== undefined) {
    query = query.where('students', 'like', filters.query)
  }

  return query.fetchPage({ page })
}
