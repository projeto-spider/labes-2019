const Student = require('../../models/Student')
const errors = require('../../../shared/errors')
const utils = require('../../utils')
const enums = require('../../../shared/enums')

module.exports = async function listStudents(ctx) {
  const { course, sort, order = 'ASC' } = ctx.request.query
  if (course !== undefined && !['cbcc', 'cbsi'].includes(course)) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_FILTER, filter: 'course' }
    return
  }

  if (
    sort !== undefined &&
    !['name', 'registrationNumber', 'crg', 'period'].includes(sort)
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
    prescribed,
    period
  } = filters
  let query = Student
  if (sort !== undefined) {
    query = query.forge().orderBy(sort, order.toUpperCase())
  }

  const filterPrescribed = prescribed === 'true'

  if (filterPrescribed) {
    query = query.query(qb => {
      qb.innerJoin('documents', 'documents.studentId', 'students.id').where(
        'documents.type',
        '=',
        enums.documents.LISTA_PRESCRICAO
      )
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
  if (noCrg === 'true') {
    query = query.where('crg', null)
  }
  if (gmail === 'true') {
    query = query.where('email', 'like', '%@gmail.com%')
  }
  if (period !== undefined) {
    query = query.where('period', period)
  }
  const defaultFiltersNames = [
    { name: 'course', type: 'string' },
    { name: 'academicHighlight', type: 'boolean' },
    { name: 'cancelled', type: 'boolean' },
    { name: 'mailingList', type: 'string' }
  ]
  const flagsFiltersNames = [
    { name: 'isFit', type: 'boolean' },
    { name: 'isConcluding', type: 'boolean' },
    { name: 'isActive', type: 'boolean' },
    { name: 'isForming', type: 'boolean' },
    { name: 'isGraduating', type: 'boolean' }
  ]
  const filtersNames = filterPrescribed
    ? defaultFiltersNames
    : defaultFiltersNames.concat(flagsFiltersNames)

  query = filtersNames.reduce((query, { name, type }) => {
    if (filters[name] !== undefined) {
      const isBoolean = type === 'boolean'
      const rawValue = filters[name]
      const value = isBoolean ? rawValue === 'true' : rawValue
      return query.where(name, value)
    }
    return query
  }, query)

  return query.fetchPage({ page })
}
