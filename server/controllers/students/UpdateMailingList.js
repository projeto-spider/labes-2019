const Student = require('../../models/Student')
const Solicitation = require('../../models/Solicitation')
const { knex } = require('../../db')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

module.exports = async function updateMailingList(ctx) {
  const fieldsBody = ['mailingList', 'type', 'studentIds', 'solicitationIds']
  {
    const { valid, invalidParams } = utils.validatePayload(
      ctx.request.body,
      fieldsBody
    )
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
  {
    const update = ctx.request.body
    const valid = fieldsBody.every(field => update[field] !== undefined)
    if (!valid) {
      ctx.status = 400
      ctx.body = { code: errors.INVALID_REQUEST }
      return
    }
    const filter = validateFilter(update)
    if (typeof filter === 'string') {
      ctx.status = 400
      ctx.body = { code: errors.INVALID_FILTER, filter }
      return
    }
  }

  const { mailingList, type, studentIds, solicitationIds } = ctx.request.body

  let additions = 0
  let deletions = 0
  const promises = []

  if (type === 'remove') {
    await knex.transaction(async trx => {
      const modelsToRemove = await Student.where('id', 'in', studentIds)
        .where('mailingListToRemove', mailingList)
        .fetchAll({
          transacting: trx
        })
      deletions += modelsToRemove.length
      for (const model of modelsToRemove) {
        const mailingList =
          model.get('mailingList') === model.get('mailingListToRemove')
            ? 'none'
            : model.get('mailingList')
        promises.push(
          model.save(
            { mailingList, mailingListToRemove: 'none' },
            { patch: true, transacting: trx }
          )
        )
      }
      return Promise.all(promises)
    })
  } else {
    await knex.transaction(async trx => {
      const modelsToAdd = await Student.where('id', 'in', studentIds)
        .where('mailingListToAdd', mailingList)
        .fetchAll({
          transacting: trx
        })

      additions += modelsToAdd.length

      for (const model of modelsToAdd) {
        promises.push(
          model.save(
            { mailingList, mailingListToAdd: 'none' },
            { patch: true, transacting: trx }
          )
        )
      }

      if (['concluding', 'freshman'].includes(mailingList)) {
        const query = { type: mailingList }
        let deletionsSolicitations = 0
        deletionsSolicitations += await Solicitation.where(
          'id',
          'in',
          solicitationIds
        )
          .where(query)
          .count('*', {
            transacting: trx
          })
        if (deletionsSolicitations > 0) {
          promises.push(
            Solicitation.where('id', 'in', solicitationIds)
              .where(query)
              .destroy({ transacting: trx })
          )
        }
        additions += deletionsSolicitations
      }
      return Promise.all(promises)
    })
  }
  ctx.status = 200
  ctx.body = {
    additions,
    deletions
  }
}

function validateFilter({ mailingList, type, studentIds, solicitationIds }) {
  if (!['active', 'concluding', 'freshman'].includes(mailingList)) {
    return 'mailingList'
  }
  if (!['add', 'remove'].includes(type)) {
    return 'type'
  }
  {
    const { valid } = utils.validateType(studentIds, ['number'])
    if (!valid) {
      return 'studentIds'
    }
  }
  {
    const { valid } = utils.validateType(solicitationIds, ['number'])
    if (!valid) {
      return 'solicitationIds'
    }
  }
  return true
}
