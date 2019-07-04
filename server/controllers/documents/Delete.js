const path = require('path')
const fse = require('fs-extra')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

const Documents = require('../../models/Document')
const Students = require('../../models/Student')

const dirUploads = path.join(__dirname, '../../../storage/')

module.exports = async function removeDocument(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])
  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }
  const { studentId, id } = ctx.params

  const [student, document] = await Promise.all([
    Students.where('id', studentId).fetch(),
    Documents.where('id', id)
      .where('studentId', studentId)
      .fetch()
  ])

  if (!student || !document) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  const documentType = document.get('type')
  const directory = path.join(dirUploads, student.get('registrationNumber'))
  const file = utils.fileName(directory, student, documentType)

  const processes = document
    .destroy()
    .then(() => utils.updateStudentFitness(student))

  try {
    await fse.remove(file)
  } catch (err) {
    if (err.code !== 'ENOENT') {
      throw err
    }

    await processes

    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  await processes

  ctx.status = 204
  ctx.body = undefined
}
