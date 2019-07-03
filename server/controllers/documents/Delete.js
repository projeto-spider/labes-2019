const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

const Documents = require('../../models/Document')
const Students = require('../../models/Student')

const access = promisify(fs.access)
const del = promisify(fs.unlink)

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
  const diretory = path.join(dirUploads, student.get('registrationNumber'))
  const file = utils.fileName(diretory, student, documentType)

  try {
    await access(file)
  } catch (e) {
    // File doesn't exist but the document does
    await document.destroy()

    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  // First destroy the row
  await document.destroy()
  // If it works, delete the file
  await del(file)

  ctx.status = 204
  ctx.body = undefined
}
