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
  'missingCollation',
  'academicHighlight',
  'cancelled',
  'mailingList',
  'mailingListToAdd',
  'mailingListToRemove',
  'advisor',
  'term',
  'cd',
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
  const studentUpdate = { ...ctx.request.body }

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

  const editedTerm = studentUpdate.term
  const canEditTerm =
    studentFind.get('isForming') ||
    studentFind.get('isGraduating') ||
    studentFind.get('isConcluding')
  if (editedTerm && !canEditTerm) {
    ctx.status = 422
    ctx.body = { code: errors.UNPROCESSABLE_ENTITY }
    return
  }

  if (
    studentUpdate.missingCollation &&
    !(studentFind.get('isConcluding') || studentFind.get('isGraduating'))
  ) {
    ctx.status = 422
    ctx.body = { code: errors.UNPROCESSABLE_ENTITY }
    return
  }

  // Client wants to force people that missed collation
  // to isGraduating. Don't give much thought here.
  const shouldKickToGraduating =
    studentFind.get('isConcluding') && studentUpdate.missingCollation
  if (shouldKickToGraduating) {
    studentUpdate.isConcluding = false
    studentUpdate.isGraduating = true
  }

  await studentFind.save(studentUpdate)

  await utils.updateStudentFitness(studentFind)

  ctx.body = studentFind
}
