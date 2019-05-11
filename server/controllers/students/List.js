const Student = require('../../models/Student')
const errors = require('../../../shared/errors')

module.exports = async function listStudents(ctx) {
  const { course } = ctx.request.query
  if (course !== undefined && !['cbcc', 'cbsi'].includes(course)) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_FILTER, filter: 'course' }
    return
  }
  ctx.body = await filterStudents(ctx.request.query)
}
/**
 * Filter students 👍
 * @param {object} query - Filter args
 * @return {Promise} Bookshelf
 */
function filterStudents(filters) {
  const { page = 1, name, registrationNumber, minCrg, maxCrg, eqCrg } = filters
  let query = Student
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
