const Defense = require('../../models/Defense.js')
const errors = require('../../../shared/errors')

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
  const { user } = ctx.state.user

  const validRequest = requiredFields.every(item => payload[item] !== undefined)
  if (!validRequest) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
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
    userId: user.id
  }

  ctx.status = 201
  ctx.body = await Defense.forge(data).save()
}
