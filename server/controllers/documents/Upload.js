const fs = require('fs')
const path = require('path')
const errors = require('../../../shared/errors')
const enumi = require('../../../shared/enum')

const Students = require('../../models/Student')
const Documents = require('../../models/Document')

module.exports = async function uploadDocument(ctx) {
  // reference to documentTypes '../../../shared/enum'
  const { documentType } = ctx.request.body
  const { studentID } = ctx.params

  const filePath =
    ctx.request.files && ctx.request.files.file && ctx.request.files.file.path

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

  const studentFind = await Students.where('id', studentID).fetch()
  if (studentFind !== null) {
    const documentFind = await Documents.where('studentID', studentID)
      .where('type', documentType)
      .fetch()
    const urlApi = '/api/students/' + studentID + '/documents/'
    if (documentFind === null) {
      const documentCreated = await Documents.forge().save({
        studentID: studentID,
        type: documentType,
        URL: urlApi
      })
      documentCreated.save({
        id: documentCreated.get('id'),
        URL: urlApi + documentCreated.get('id')
      })
    } else {
      documentFind.save({
        id: documentFind.get('id'),
        URL: urlApi + documentFind.get('id')
      })
    }

    const file = ctx.request.files.file
    const reader = fs.createReadStream(file.path)
    const stream = fs.createWriteStream(
      path.join(
        __dirname,
        '../../../storage/',
        studentFind.get('registrationNumber') +
          '-' +
          enumi.documents[documentType] +
          '.pdf'
      )
    )
    reader.pipe(stream)
    ctx.status = 201
    ctx.body = {
      count: file.size
    }
  } else {
    ctx.status = 400
    ctx.body = { code: errors.USER_NOT_FOUND }
  }
}
