const Student = require('../../models/Student')
const Documents = require('../../models/Document')
const errors = require('../../../shared/errors')

module.exports = async function updateStudent(ctx) {
  const { id } = ctx.params
  const studentUpdate = ctx.request.body

  if (id === undefined) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST }
    return
  }

  const studentFind = await Student.where({ id }).fetch()
  if (studentFind === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  await studentFind.save(studentUpdate)

  const docTypes = (await Documents.where({ studentId: id }).fetchAll())
    .toJSON()
    .map(entry => entry.type)
  const studentIsFit =
    !!studentFind.get('cd') && docTypes.includes(1) && docTypes.includes(2)
  if (!!studentFind.get('isFit') !== studentIsFit) {
    studentUpdate.isFit = studentIsFit ? 1 : 0
    await studentFind.save(studentUpdate)
  }

  ctx.body = studentFind
}
