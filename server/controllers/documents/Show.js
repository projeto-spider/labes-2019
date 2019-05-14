const Documents = require('../../models/Document')
const Students = require('../../models/Student')

module.exports = async function listUsers(ctx) {
  const { studentID } = ctx.params
  if (
    isNaN(studentID) ||
    (await Students.where('id', studentID)
      .fetch()
      .then(value => {
        return value === null
      }))
  ) {
    ctx.status = 400
    ctx.body = { code: 'INVALID_PARAMS', param: 'studentID' }
    return
  }

  ctx.body = await Documents.where({ studentID }).fetchAll()
}
