const fs = require('fs')
const os = require('os')
const path = require('path')
const errors = require('../../../shared/errors')

module.exports = async function uploadDocument(ctx) {
  // reference to documentTypes '../../../shared/enum'
  const filePath =
    ctx.request.files && ctx.request.files.file && ctx.request.files.file.path
  const { documentType } = ctx.request.body

  if (documentType === undefined || !['1', '2', '3'].includes(documentType)) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_PARAMS, param: 'documentType' }
    return
  }

  if (!filePath) {
    ctx.status = 400
    ctx.body = { code: errors.UPLOAD_FILE_FIELD_MISSING }
    return
  }

  const pdf = fs.readFileSync(filePath)
  if (!pdf) {
    ctx.status = 400
    ctx.body = { code: errors.IMPORT_FILE_FAILED_TO_UPLOAD }
    return
  }

  if (ctx.request.files.file.type !== 'application/pdf') {
    ctx.status = 400
    ctx.body = { code: errors.UPLOAD_FILE_TYPE_INVALID }
    return
  }
  const file = ctx.request.files.file
  const reader = fs.createReadStream(file.path)
  const stream = fs.createWriteStream(
    path.join(__dirname, '../../../storage', Math.random().toString() + '.pdf')
  )
  reader.pipe(stream)
  ctx.status = 201
  ctx.body = 'uploading ' + file.name + ' -> ' + stream.path
}
