const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

const Documents = require('../../models/Document')
const Students = require('../../models/Student')

module.exports = async function removeDocument(ctx) {
  const { studentId, id } = ctx.params

  if ((await Documents.where('id', id).count()) === 0) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  const studentFind = await Students.where('id', studentId).fetch()
  const document = await Documents.where('id', id).fetch()
  const documentType = document.get('type')

  const dirUploads = path.join(__dirname, '../../../storage/')
  const diretory = path.join(dirUploads, studentFind.get('registrationNumber'))
  const file = utils.fileName(diretory, studentFind, documentType)

  const exists = promisify(fs.access)
  const existsNoFile = await exists(file)

  if (existsNoFile) {
    return
  }

  const del = promisify(fs.unlink)
  await del(file)

  ctx.body = await Documents.where({ id })
    .where({ studentId })
    .destroy()
}
