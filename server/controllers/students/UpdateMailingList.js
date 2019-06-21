const Student = require('../../models/Student')
const Solicitation = require('../../models/Solicitation')
const { knex } = require('../../db')
const errors = require('../../../shared/errors')

module.exports = async function updateMailingList(ctx) {
  const { mailingList } = ctx.request.body
  if (
    mailingList === undefined ||
    !['active', 'concluding', 'freshman'].includes(mailingList)
  ) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_FILTER, filter: 'mailingList' }
    return
  }

  let additions = 0
  let deletions = 0

  await knex.transaction(async trx => {
    const [modelsToAdd, modelsToRemove] = await Promise.all([
      Student.where('mailingListToAdd', mailingList).fetchAll({
        transacting: trx
      }),
      Student.where('mailingListToRemove', mailingList).fetchAll({
        transacting: trx
      })
    ])

    additions += modelsToAdd.length
    deletions += modelsToRemove.length

    const promises = []

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
      deletions += await Solicitation.where(query).count('*', {
        transacting: trx
      })
      promises.push(Solicitation.where(query).destroy({ transacting: trx }))
    }

    return Promise.all(promises)
  })

  ctx.status = 200
  ctx.body = {
    additions,
    deletions
  }
}
