const Defense = require('../../models/Defense')
const utils = require('../../utils')
const enums = require('../../../shared/enums')

module.exports = async function listDefenses(ctx) {
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
