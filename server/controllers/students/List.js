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

  if (
    sort !== undefined &&
    !['name', 'registrationNumber', 'crg'].includes(sort)
  ) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_ARGUMENT, filter: 'sort' }
    return
  }
  if (!['ASC', 'DESC'].includes(order.toUpperCase())) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_ARGUMENT, filter: 'order' }
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
    noCrg,
    sort,
    order = 'ASC',
    gmail,
    email,
    prescribed
  } = filters
  let query = Student
  if (sort !== undefined) {
    query = query.forge().orderBy(sort, order.toUpperCase())
  }
  const isPrescribed = prescribed !== undefined && prescribed === '1'
  if (isPrescribed) {
    query = query.query(qb => {
      qb.innerJoin('documents', 'documents.studentId', 'students.id')
        .where('documents.type', '=', '3')
        .andWhere(qb => qb.where('isGraduating', '1').orWhere('isForming', '1'))
    })
  }
  if (name !== undefined) {
    query = query.where('name', 'like', name)
  }
  if (registrationNumber !== undefined) {
    query = query.where('registrationNumber', 'like', registrationNumber)
  }
  if (email !== undefined) {
    query = query.where('email', 'like', email)
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
  if (noCrg) {
    query = query.where('crg', null)
  }
  if (gmail) {
    query = query.where('email', 'like', '%@gmail.com%')
  }
  const defaultFiltersNames = [
    'course',
    'academicHighlight',
    'cancelled',
    'mailingList'
  ]
  const flagsFiltersNames = [
    'isFit',
    'isConcluding',
    'isActive',
    'isForming',
    'isGraduating'
  ]
  const filtersNames = isPrescribed
    ? defaultFiltersNames
    : defaultFiltersNames.concat(flagsFiltersNames)

  query = filtersNames.reduce((query, filterName) => {
    if (filters[filterName] !== undefined) {
      return query.where(filterName, filters[filterName])
    }
    return query
  }, query)
  return query.fetchPage({ page })
}
