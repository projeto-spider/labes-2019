const Documents = require('../../models/Document')
const Students = require('../../models/Student')
const errors = require('../../../shared/errors')

module.exports = async function showDocument(ctx) {
  const { studentID, id } = ctx.params
  if (
    await Students.where('id', studentID)
      .fetch()
      .then(value => {
        return value === null
      })
  ) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_PARAMS, param: 'studentID' }
    return
  }
  if (
    await Documents.where({ id })
      .fetch()
      .then(value => {
        return value === null
      })
  ) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_PARAMS, param: 'id' }
    return
  }

  ctx.body = await Documents.where({ studentID })
    .where({ id })
    .fetch()
}
