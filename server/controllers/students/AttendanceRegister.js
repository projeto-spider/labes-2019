const PDFDocument = require('pdfkit')
const Student = require('../../models/Student')
const utils = require('../../utils')
const errors = require('../../../shared/errors')
const ListaFrequencia = require('../../models/tccdocs/listaFrequencia')

const month = {
  '1': 'Janeiro',
  '2': 'Fevereiro',
  '3': 'Março',
  '4': 'Abril',
  '5': 'Maio',
  '6': 'Junho',
  '7': 'Julho',
  '8': 'Agosto',
  '9': 'Setembro',
  '10': 'Outubro',
  '11': 'Novembro',
  '12': 'Dezembro'
}

module.exports = async function generateAttendanceRegister(ctx) {
  const { valid, invalidParams } = utils.validateQuery(ctx.request.query, [])
  if (!valid) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_QUERY, invalidParams }
    return
  }
  const { course } = ctx.params
  if (!['cbcc', 'cbsi'].includes(course)) {
    ctx.status = 400
    ctx.body = { code: errors.INVALID_REQUEST, param: course }
    return
  }
  const students = await Student.where({ course })
    .where('isFit', true)
    .where('isGraduating', true)
    .where('missingCollation', false)
    .fetchAll()
  if (students === null || !students.length) {
    ctx.status = 422
    ctx.body = { code: errors.UNPROCESSABLE_ENTITY }
    return
  }
  const studentList = students.map(student => student.get('name'), [])
  const today = new Date()
  const data = {
    dia: today.getUTCDate(),
    mes: month[today.getUTCMonth()],
    ano: today.getUTCFullYear(),
    nomeDosAlunos: studentList,
    curso:
      course === 'cbcc' ? 'Ciência da Computação' : 'Sistemas de Informação'
  }
  const doc = new PDFDocument({
    layout: 'landscape',
    size: [595, 841]
  })
  ListaFrequencia(doc, data)
  const title = 'lista-de-frequencia.pdf'
  ctx.status = 200
  ctx.set('Content-Type', 'application/pdf')
  ctx.set('Content-Disposition', `filename=${title}`)
  ctx.body = doc
}
