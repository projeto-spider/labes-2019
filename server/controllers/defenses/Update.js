const Defense = require('../../models/Defense')
const errors = require('../../../shared/errors')
const utils = require('../../utils')
const registrationNumbersToStudents = require('./registrationNumbersToStudents')

const requiredFields = [
  'userId',
  'course',
  'status',
  'registrationNumbers',
  'students',
  'local',
  'title',
  'keywords',
  'summary',

  'advisorName',
  'advisorTitle',
  'advisorType',

  'evaluator1Name',
  'evaluator1Title',
  'evaluator1Type',

  'evaluator2Name',
  'evaluator2Title',
  'evaluator2Type'
]

const optionalFields = [
  'date',
  'time',

  'coAdvisorName',
  'coAdvisorTitle',
  'coAdvisorType',

  'evaluator3Name',
  'evaluator3Title',
  'evaluator3Type'
]

const allFields = requiredFields.concat(optionalFields)

module.exports = async function updateDefense(ctx) {
  const payload = ctx.request.body
  {
    const { valid, invalidParams } = utils.validatePayload(payload, allFields)
    if (!valid) {
      ctx.status = 400
      ctx.body = { code: errors.INVALID_BODY, invalidParams }
      return
    }
  }

  {
    const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])
    if (!valid) {
      ctx.status = 400
      ctx.body = { code: errors.INVALID_QUERY, invalidParams }
      return
    }
  }

  const { id } = ctx.params

  if (id === undefined) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
    return
  }

  const defense = await Defense.where({ id }).fetch()
  if (defense === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  const { students, invalidRegistrationNumbers } = payload.registrationNumbers
    ? await registrationNumbersToStudents(payload.registrationNumbers)
    : { students: [], invalidRegistrationNumbers: [] }

  if (invalidRegistrationNumbers.length) {
    ctx.status = 422
    ctx.body = {
      code: errors.INVALID_REGISTRATION_NUMBERS,
      registrationNumbers: invalidRegistrationNumbers
    }
    return
  }

  const studentsWithDefense = students.filter(
    student =>
      student.get('defenseId') && student.get('defenseId') !== defense.get('id')
  )
  if (studentsWithDefense.length) {
    ctx.status = 422
    ctx.body = {
      code: errors.STUDENT_HAS_DEFENSE,
      registrationNumbers: studentsWithDefense.map(student =>
        student.get('registrationNumber')
      )
    }
    return
  }

  const studentsWithoutDefense = students.filter(
    student => !student.get('defenseId')
  )

  await Promise.all([
    defense.save(payload),
    ...studentsWithoutDefense.map(student =>
      student.save({ defenseId: defense.get('id') })
    )
  ])

  ctx.body = defense
}
