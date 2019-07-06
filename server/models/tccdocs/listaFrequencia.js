module.exports = function model(doc, { dia, mes, ano, nomeDosAlunos, curso }) {
  // const doc = new PDFDocument

  // Header
  doc.image('./server/models/tccdocs/img/logoFacomp.png', 50, 30, {
    align: 'left',
    valign: 'top'
  })
  doc.fontSize(12).text(
    `
      UNIVERSIDADE FEDERAL DO PARÁ
      INSTITUTO DE CIÊNCIAS EXATAS E NATURAIS
      FACULDADE DE COMPUTAÇÃO
      `,
    60,
    40,
    {
      align: 'center'
    }
  )
  // End of Header

  doc
    .font('Times-Bold')
    .fontSize(15)
    .text(`CURSO DE BACHARELADO EM `, 100, 170, {
      align: 'left',
      continued: true
    })
    .fillColor('black')
    .text(curso.toUpperCase(), { underline: true, color: 'black' })

  doc
    .fontSize(15)
    .text(`COLAÇÃO DE GRAU REALIZADA NO DIA: `, 100, 220, { align: 'left' })
    .fillColor('red')
    .text(`${31} de ${'fevereiro'} de ${2030}`, { indent: 72 })

  doc
    .font('Times-Bold')
    .fontSize(13)
    .fillColor('black')
    .text(`Lista de Presença`, 100, 300, {
      align: 'left'
    })

  row(doc, 320)
  textInRow(doc, 'NOME', 165, 325)
  textInRow(doc, 'Assinatura', 445, 325)

  const alunos = nomeDosAlunos.split(',')
  let rowHeight = 340
  for (const aluno of alunos) {
    row(doc, rowHeight)
    textInRow(doc, aluno, 30, rowHeight + 5)

    rowHeight += 20
  }

  doc
    .lineCap('butt')
    .moveTo(350, 320)
    .lineTo(350, rowHeight)
    .stroke()

  doc
    .fillColor('red')
    .font('Times-Roman')
    .fontSize(12)
    .text(`Belém, ${dia} de ${mes} de ${ano}.`, 100, 460, {
      align: 'right'
    })
  return doc
}

function textInRow(doc, text, width, heigth, options = {}) {
  if (options.hasOwnProperty('bold')) doc.font('Times-Bold')
  doc.y = heigth
  doc.x = width
  doc.fillColor('black')
  doc.text(text, {
    paragraphGap: 5,
    indent: 5,
    align: 'justify',
    columns: 1
  })
  return doc
}

function row(doc, heigth) {
  doc
    .lineJoin('miter')
    .rect(30, heigth, 580, 20)
    .stroke()
  return doc
}
