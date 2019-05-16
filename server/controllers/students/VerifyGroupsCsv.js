const fs = require('fs')
const utils = require('../../utils')
const errors = require('../../../shared/errors')
const { knex } = require('../../db')

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

  const csvData = utils.parseCsv(csv)
  const csvMailList = csvData.map(entry => entry['Endereço de e-mail'])

  const query = `
    UPDATE
      students
    SET
      comments = 'Adicionar ao Grupo do Google'
    WHERE
      students.email
    NOT IN
      ('null','${csvMailList.join("','")}')
  `

  await knex.raw(query)
  ctx.status = 201
}

const validHeader =
  'Endereço de e-mail,Apelido,Status do grupo,Status do e-mail,Preferência de e-mail,Permissões de postagem,Ano de inscrição,Mês de inscrição,Dia de inscrição,Hora de inscrição,Minuto de inscrição,Segundo de inscrição,Fuso horário'

/**
 * Read a CSV from Google Groups and verify if it's valid (return true) or
 * return a message of what's wrong.
 *
 * @param {string} csv - CSV from Google Groups
 * @return {(string|boolean)} True for valid or string for error message
 *
 * @example
 *
 *     const csv = `Endereço de e-mail,Apelido,Status do grupo,Status do e-mail,Preferência de e-mail,Permissões de postagem,Ano de inscrição,Mês de inscrição,Dia de inscrição,Hora de inscrição,Minuto de inscrição,Segundo de inscrição,Fuso horário
 * onemail@themail.org,,pendente,,"sem e-mail","não permitido",2019,4,25,22,29,54,Fuso horário de Brasília`
 *     validate(csv)
 */
function validate(csv) {
  try {
    const lines = csv.replace('\r\n', '\n').split('\n')

    if (lines.length < 2) {
      return errors.IMPORT_CSV_INVALID_LENGTH
    }

    if (lines[0] !== validHeader) {
      return errors.IMPORT_CSV_INVALID_HEADER
    }

    const rightNumberOfColumns = lines.every(
      line => line.split(',').length === 13
    )

    if (!rightNumberOfColumns) {
      return errors.IMPORT_CSV_INVALID_COL_NUMBER
    }

    return true
  } catch (err) {
    return errors.IMPORT_CSV_INVALID_FILE
  }
}
