const Student = require('../../models/Student')
const Solicitation = require('../../models/Solicitation')
const errors = require('../../../shared/errors')

module.exports = async function emailChanges(ctx) {
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

  const prepare = models =>
    models.toJSON
      ? models.toJSON().map(({ name, email }) => ({
          name,
          email
        }))
      : []

  const additions = prepare(additionsViaApp).concat(
    prepare(additionsViaSolicitations)
  )
  const deletions = prepare(deletionsViaApp)

  ctx.status = 200
  ctx.body = {
    additions,
    deletions
  }
}
