const PDFDocument = require('pdfkit')
const Student = require('../../models/Student')
const utils = require('../../utils')
const errors = require('../../../shared/errors')
const ListaFrequencia = require('../../models/tccdocs/listaFrequencia')

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
  let studentList = []
  const students = await Student.where({ course })
    .where('isFit', true)
    .where('isGraduating', true)
    .fetchAll()
  if (students !== null && Boolean(students.length)) {
    studentList = students.map(student => student.get('name'), [])
  }
  const today = new Date()
  today.setHours(today.getHours() - 3)
  const data = {
    dia: today.getUTCDate(),
    mes: utils.translate(today.getUTCMonth() + 1),
    ano: today.getUTCFullYear(),
    nomeDosAlunos: studentList,
    curso:
      course === 'cbcc' ? 'Ciência da Computação' : 'Sistemas de Informação'
  }
  const doc = new PDFDocument({
    layout: 'portrait',
    size: [595, 841]
  })
  if (studentList.length > 10) {
    const limit = studentList.length
    let sliceStart = 0
    let sliceEnd = 10
    while (sliceEnd < limit) {
      sliceEnd = sliceStart + 10 < limit ? sliceStart + 10 : limit
      data.nomeDosAlunos = studentList.slice(sliceStart, sliceEnd)
      ListaFrequencia(doc, sliceStart + 1, data)
      if (sliceEnd < limit) doc.addPage()
      sliceStart = sliceEnd
    }
  } else {
    ListaFrequencia(doc, 1, data)
  }
  const title = `${course}-lista-de-frequencia.pdf`
  doc.info.Title = title
  await doc.end()
  ctx.status = 200
  ctx.set('Content-Type', 'application/pdf')
  ctx.set('Content-Disposition', `filename=${title}`)
  ctx.body = doc
}
