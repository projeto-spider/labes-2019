const Defense = require('../../models/Defense')
const utils = require('../../utils')

module.exports = async function listDefenses(ctx) {
  utils.paginateContext(ctx, await filter(ctx.request.query))
}
/**
 * Filter defenses 👍
 * @param {object} query - Filter args
 * @return {Promise} Bookshelf
 */
function filter(filters) {
  const { page = 1, status, course } = filters

  let query = Defense

  if (status !== undefined) {
    query = query.where('status', status)
  }

  if (course !== undefined) {
    query = query.where('course', course)
  }

  return query.fetchPage({ page })
}
