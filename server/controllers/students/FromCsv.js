const fs = require('fs')
const utils = require('../../utils')
const errors = require('../../../shared/errors')

module.exports = async function studentsFromCsv(ctx) {
  const filePath =
    ctx.request.files && ctx.request.files.csv && ctx.request.files.csv.path

  if (!filePath) {
    ctx.status = 400
    ctx.body = { code: errors.IMPORT_CSV_MISSING_CSV_FIELD }
    return
  }

  const csv = fs.readFileSync(filePath, 'utf8')

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
    const lines = csv.split('\n')

    if (lines.length < 2) {
      return errors.IMPORT_CSV_INVALID_LENGTH
    }

    if (lines[0] !== validHeader) {
      return errors.IMPORT_CSV_INVALID_HEADER
    }

    const rightNumberOfColumns = lines.every(
      line => line.split(',').length === 9
    )

    if (!rightNumberOfColumns) {
      return errors.IMPORT_CSV_INVALID_COL_NUMBER
    }

    return true
  } catch (err) {
    return errors.IMPORT_CSV_INVALID_FILE
  }
}
