const fs = require('fs')
const path = require('path')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

const Documents = require('../../models/Document')
const Students = require('../../models/Student')

module.exports = async function removeDocument(ctx) {
  const { studentId, id } = ctx.params

  if ((await Students.where('id', studentId).count()) === 0) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  const studentFind = await Students.where('id', studentId).fetch()
  let documentType = await Documents.where('id', id).fetch()
  documentType = documentType.get('type')

  const dirUploads = path.join(__dirname, '../../../storage/')
  const diretory = path.join(dirUploads, studentFind.get('registrationNumber'))
  const file = utils.fileName(diretory, studentFind, documentType)

  if (!fs.existsSync(file)) {
    return
  }
  fs.unlinkSync(file)
  ctx.body = await Documents.where({ id })
    .where({ studentId })
    .destroy()
}
