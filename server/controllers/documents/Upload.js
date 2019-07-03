const fs = require('fs')
const path = require('path')
const errors = require('../../../shared/errors')
const utils = require('../../utils')

const Students = require('../../models/Student')
const Documents = require('../../models/Document')

module.exports = async function uploadDocument(ctx) {
  {
    const { valid, invalidParams } = utils.validatePayload(ctx.request.body, [
      'documentType'
    ])
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
  const { documentType } = ctx.request.body
  const { studentId } = ctx.params

  const filePath =
    ctx.request.files && ctx.request.files.file && ctx.request.files.file.path

  if (documentType === undefined || !['1', '2', '3'].includes(documentType)) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
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

  const studentFind = await Students.where('id', studentId).fetch()
  if (studentFind === null) {
    ctx.status = 404
    ctx.body = { code: errors.NOT_FOUND }
    return
  }

  const documentFind = await Documents.where('studentId', studentId)
    .where('type', documentType)
    .fetch()
  const urlApi = '/api/students/' + studentId + '/documents/'

  if (documentFind === null) {
    const documentCreated = await Documents.forge().save({
      studentId,
      type: documentType,
      url: urlApi
    })
    await documentCreated.save({
      id: documentCreated.get('id'),
      url: urlApi + documentCreated.get('id') + '/view'
    })
  } else {
    await documentFind.save({
      id: documentFind.get('id'),
      url: urlApi + documentFind.get('id') + '/view'
    })
  }

  const dirUploads = path.join(__dirname, '../../../storage/')

  if (!fs.existsSync(dirUploads)) {
    fs.mkdirSync(dirUploads)
  }

  const dirStudents = path.join(
    dirUploads,
    studentFind.get('registrationNumber')
  )

  if (!fs.existsSync(dirStudents)) {
    fs.mkdirSync(dirStudents)
  }

  const file = ctx.request.files.file
  const reader = fs.createReadStream(file.path)
  const stream = fs.createWriteStream(
    utils.fileName(dirStudents, studentFind, documentType)
  )
  reader.pipe(stream)

  await utils.updateStudentFitness(studentFind)

  ctx.status = 201
  ctx.body = {
    count: file.size
  }
}
