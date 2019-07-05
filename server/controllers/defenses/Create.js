const Defense = require('../../models/Defense')
const errors = require('../../../shared/errors')
const utils = require('../../utils')
const registrationNumbersToStudents = require('./registrationNumbersToStudents')

const requiredFields = [
  'course',
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

module.exports = async function createDefense(ctx) {
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

  const { user } = ctx.state.user

  const validRequest = requiredFields.every(item => payload[item] !== undefined)
  if (!validRequest) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
    return
  }

  const {
    students,
    invalidRegistrationNumbers
  } = await registrationNumbersToStudents(payload.registrationNumbers)

  if (invalidRegistrationNumbers.length) {
    ctx.status = 422
    ctx.body = {
      code: errors.INVALID_REGISTRATION_NUMBERS,
      registrationNumbers: invalidRegistrationNumbers
    }
    return
  }

  const studentsWithDefense = students.filter(student =>
    student.get('defenseId')
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

  const fromPayload = allFields.reduce((acc, field) => {
    if (payload[field] !== undefined) {
      acc[field] = payload[field]
    }

    return acc
  }, {})

  const data = {
    ...fromPayload,
    userId: user.id,
    status: 'pending'
  }

  const defense = await Defense.forge(data).save()

  await Promise.all(
    students.map(student => {
      return student.save({ defenseId: defense.get('id') })
    })
  )

  ctx.status = 201
  ctx.body = defense
}
