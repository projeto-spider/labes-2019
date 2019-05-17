const Documents = require('../../models/Document')
const Students = require('../../models/Student')
const errors = require('../../../shared/errors')

module.exports = async function listDocuments(ctx) {
  const { studentId } = ctx.params
  if (
    await Students.where('id', studentId)
      .fetch()
      .then(value => {
        return value === null
      })
  ) {
    ctx.status = 404
    ctx.body = { code: errors.STUDENT_NOT_FOUND }
    return
  }

  ctx.body = await Documents.where({ studentId }).fetchAll()
}
