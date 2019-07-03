const Student = require('../../models/Student')
const utils = require('../../utils')
const errors = require('../../../shared/errors')

const fields = [
  'name',
  'registrationNumber',
  'crg',
  'course',
  'email',
  'isFit',
  'isConcluding',
  'isActive',
  'isForming',
  'isGraduating',
  'academicHighlight',
  'cancelled',
  'mailingList',
  'mailingListToAdd',
  'mailingListToRemove',
  'entryDate',
  'advisor',
  'defenseDate',
  'term',
  'recordSigned',
  'termPaper',
  'cd',
  'isUndergraduate',
  'period'
]

module.exports = async function updateStudent(ctx) {
  {
    const { valid, invalidParams } = utils.validatePayload(
      ctx.request.body,
      fields
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

  await utils.updateStudentFitness(studentFind)

  ctx.body = studentFind
}
