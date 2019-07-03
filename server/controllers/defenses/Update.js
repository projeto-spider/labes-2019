const Defense = require('../../models/Defense')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

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

  await defense.save(payload)
  ctx.body = defense
}
