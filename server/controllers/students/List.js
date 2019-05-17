const Student = require('../../models/Student')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

module.exports = async function listStudents(ctx) {
  const { course, sort, order = 'ASC' } = ctx.request.query
  if (course !== undefined && !['cbcc', 'cbsi'].includes(course)) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_FILTER, filter: 'course' }
    return
  }

  if (sort !== undefined && !['name', 'registrationNumber'].includes(sort)) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_SORT_ARGUMENT, filter: 'sort' }
    return
  }
  if (order !== undefined && !['ASC', 'DESC'].includes(order)) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_ORDER_ARGUMENT, filter: 'order' }
    return
  }
  utils.paginateContext(ctx, await filterStudents(ctx.request.query))
}
/**
 * Filter students 👍
 * @param {object} query - Filter args
 * @return {Promise} Bookshelf
 */
function filterStudents(filters) {
  const {
    page = 1,
    name,
    registrationNumber,
    minCrg,
    maxCrg,
    eqCrg,
    sort,
    order
  } = filters
  let query = Student
  if (sort !== undefined) {
    query = query.forge().orderBy(sort, order)
  }
  if (name !== undefined) {
    query = query.where('name', 'like', name)
  }
  if (registrationNumber !== undefined) {
    query = query.where('registrationNumber', 'like', registrationNumber)
  }
  if (minCrg !== undefined) {
    query = query.where('crg', '>', minCrg)
  }
  if (maxCrg !== undefined) {
    query = query.where('crg', '<', maxCrg)
  }
  if (eqCrg !== undefined) {
    query = query.where('crg', eqCrg)
  }
  const filtersNames = [
    'course',
    'email',
    'isFit',
    'isConcluding',
    'isActive',
    'isForming',
    'isGraduating',
    'academicHighlight',
    'cancelled',
    'prescribed',
    'mailingList'
  ]
  query = filtersNames.reduce((query, filterName) => {
    if (filters[filterName] !== undefined) {
      return query.where(filterName, filters[filterName])
    }
    return query
  }, query)
  return query.fetchPage({ page })
}
