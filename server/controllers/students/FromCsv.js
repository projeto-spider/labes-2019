const fs = require('fs')
const { promisify } = require('util')
const detectCharacterEncoding = require('detect-character-encoding')
const utils = require('../../utils')
const errors = require('../../../shared/errors')

const readFile = promisify(fs.readFile)

module.exports = async function studentsFromCsv(ctx) {
  {
    const { valid, invalidParams } = utils.validatePayload(ctx.request.body, [])
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
  const filePath =
    ctx.request.files && ctx.request.files.csv && ctx.request.files.csv.path

  if (!filePath) {
    ctx.status = 400
    ctx.body = { code: errors.IMPORT_CSV_MISSING_CSV_FIELD }
    return
  }

  const csv = await readFileWithEncode(filePath)

  if (!csv) {
    ctx.status = 400
    ctx.body = { code: errors.IMPORT_CSV_FAILED_TO_UPLOAD }
    return
  }

  const validation = validate(csv)

  if (typeof validation === 'string') {
    ctx.status = 400
    ctx.body = { code: validation }
    return
  }

  const data = utils.parseCsv(csv)
  const digested = utils.digestSigaaData(data)
  const hasRepeatRegistrationNumber = (() => {
    const registrationNumbers = digested.map(
      ({ registrationNumber }) => registrationNumber
    )
    return new Set(registrationNumbers).size !== registrationNumbers.length
  })()

  if (hasRepeatRegistrationNumber) {
    ctx.status = 400
    ctx.body = { code: errors.IMPORT_CSV_REGISTRATION_NUMBER_REPEATED }
    return
  }

  await utils.batchUpdateStudents(digested)

  ctx.status = 201
  ctx.body = {
    count: digested.length
  }
}

const validHeader =
  'Matrícula,AnoIngresso,Nome,CPF,DataNascimento,NomeMae,Municipio,Curso,Status'

/**
 * Read a CSV from SIGAA and verify if it's valid (return true) or
 * return a message of what's wrong.
 *
 * @param {string} csv - CSV from SIGAA
 * @return {(string|boolean)} True for valid or string for error message
 *
 * @example
 *
 *     const csv = `Matrícula,AnoIngresso,Nome,CPF,DataNascimento,NomeMae,Municipio,Curso,Status
 * 201704940001,2017,FELIPE SOUZA FERREIRA,111.111.111-11,1/29/1995,VITORIA DIAS ROCHA,Belém,CIENCIA DA COMPUTACAO,FORMANDO`
 *     validate(csv)
 */
function validate(csv) {
  try {
    const lines = csv
      .replace(/;/g, ',')
      .replace('\r\n', '\n')
      .split('\n')
      .filter(line => line)

    if (lines.length < 2) {
      return errors.IMPORT_CSV_INVALID_LENGTH
    }

    if (!lines[0].startsWith(validHeader)) {
      return errors.IMPORT_CSV_INVALID_HEADER
    }

    const rightNumberOfColumns = lines.every(
      line => line.split(',').length >= 9
    )

    if (!rightNumberOfColumns) {
      return errors.IMPORT_CSV_INVALID_COL_NUMBER
    }

    return true
  } catch (err) {
    return errors.IMPORT_CSV_INVALID_FILE
  }
}

async function readFileWithEncode(path) {
  const buffer = await readFile(path)
  let encoding = 'utf8'

  try {
    const detected = detectCharacterEncoding(buffer)
    if (detected.encoding === 'ISO-8859-1') {
      encoding = 'latin1'
    }
  } catch (err) {
    // TODO
  }

  return buffer.toString(encoding)
}
