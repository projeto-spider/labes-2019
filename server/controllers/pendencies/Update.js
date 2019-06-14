const errors = require('../../../shared/errors')
const Students = require('../../models/Student')
const Pendencies = require('../../models/Pendency')
const Subjects = require('../../models/Subject')
const { knex } = require('../../db')

module.exports = async function updatePendencies(ctx) {
  const { studentId } = ctx.params
  const subjects = ctx.request.body

  if ((await Students.where('id', studentId).count()) === 0) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  const subjectsIdsReceived = subjects.map(subject => subject.id)

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

  ctx.body = await knex.transaction(async trx => {
    const subjectsIds = await Pendencies.where({ studentId })
      .fetchAll({ transacting: trx })
      .then(collection => collection.map(pendency => pendency.get('subjectId')))

    const subjectsFind = await Subjects.where('id', 'in', subjectsIds).fetchAll(
      { transacting: trx }
    )
    return subjectsFind
  })
}
