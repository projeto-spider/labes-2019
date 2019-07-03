const errors = require('../../../shared/errors')
const Students = require('../../models/Student')
const Pendencies = require('../../models/Pendency')
const { knex } = require('../../db')
const utils = require('../../utils')

module.exports = async function pendenciesFromBatch(ctx) {
  {
    const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])
    if (!valid) {
      ctx.status = 400
      ctx.body = { code: errors.INVALID_QUERY, invalidParams }
      return
    }
  }
  {
    const { valid, invalidParams } = utils.validateType(ctx.request.body, [
      'number'
    ])
    if (!valid) {
      ctx.status = 400
      ctx.body = { code: errors.INVALID_BODY, invalidParams }
      return
    }
  }
  const { studentId } = ctx.params
  const subjectsIdsReceived = ctx.request.body

  if ((await Students.where('id', studentId).count()) === 0) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  await knex.transaction(async trx => {
    const pendenciesExisting = await Pendencies.where({ studentId }).fetchAll({
      transacting: trx
    })

    const subjectsIdsExisting = pendenciesExisting.map(pend =>
      pend.get('subjectId')
    )

    const addPendencies = subjectsIdsReceived.filter(
      id => !subjectsIdsExisting.includes(id)
    )
    const delPendencies = pendenciesExisting.filter(
      pendency => !subjectsIdsReceived.includes(pendency.get('subjectId'))
    )
    const addPromises = addPendencies.map(subjectId =>
      new Pendencies({ subjectId, studentId }).save(null, { transacting: trx })
    )
    const delPromises = delPendencies.map(({ id }) =>
      Pendencies.where({ id }).destroy({ transacting: trx })
    )
    return Promise.all(addPromises.concat(delPromises))
  })

  ctx.body = await Pendencies.where({ studentId }).fetchAll()
}
