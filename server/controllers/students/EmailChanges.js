const Student = require('../../models/Student')
const Solicitation = require('../../models/Solicitation')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

module.exports = async function emailChanges(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [
    'mailingList'
  ])
  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }
  const { mailingList } = ctx.request.query
  if (
    mailingList === undefined ||
    !['active', 'concluding', 'freshman'].includes(mailingList)
  ) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_FILTER, filter: 'mailingList' }
    return
  }

  const promises = [
    Student.where('mailingListToAdd', mailingList).fetchAll(),
    Student.where('mailingListToRemove', mailingList).fetchAll()
  ]

  if (['concluding', 'freshman'].includes(mailingList)) {
    promises.push(Solicitation.where('type', mailingList).fetchAll())
  }

  const [
    additionsViaApp,
    deletionsViaApp,
    additionsViaSolicitations = []
  ] = await Promise.all(promises)

  const prepare = (models, type) =>
    models.toJSON
      ? models.toJSON().map(({ id, name, email }) => ({
          id,
          name,
          email,
          type
        }))
      : []

  const additions = prepare(additionsViaApp, 'student').concat(
    prepare(additionsViaSolicitations, 'solicitation')
  )
  const deletions = prepare(deletionsViaApp, 'student')

  ctx.status = 200
  ctx.body = {
    additions,
    deletions
  }
}
