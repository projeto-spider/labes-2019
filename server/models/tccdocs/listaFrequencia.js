const path = require('path')

module.exports = function model(
  doc,
  index,
  { dia, mes, ano, nomeDosAlunos, curso }
) {
  // const doc = new PDFDocument

  // Header
  doc.image(path.join(__dirname, './img/logoFacomp.png'), 50, 30, {
    width: 70,
    height: 80,
    align: 'left',
    valign: 'top'
  })
  doc
    .font('Times-Roman')
    .fontSize(12)
    .text(
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
    .fontSize(14)
    .text(`CURSO DE BACHARELADO EM `, 50, 170, {
      align: 'left',
      continued: true
    })
    .fillColor('black')
    .text(curso.toUpperCase(), { underline: true, color: 'black' })

  doc
    .font('Times-Roman')
    .fontSize(14)
    .text(`COLAÇÃO DE GRAU REALIZADA NO DIA: `, 50, 220, {
      align: 'left',
      continued: true
    })
    .font('Times-Bold')
    .text(`${dia} de ${mes} de ${ano}`)

  doc
    .font('Times-Bold')
    .fontSize(13)
    .text(`Lista de Presença`, 50, 300, {
      align: 'left'
    })

  row(doc, 320)
  textInRow(doc, 'NOME', 145, 325)
  textInRow(doc, 'ASSINATURA', 435, 310)

  let rowHeight = 340
  for (const aluno of nomeDosAlunos) {
    row(doc, rowHeight)
    textInRow(doc, index < 10 ? '0' + index : index, 10, rowHeight + 5)
    textInRow(doc, aluno.slice(0, 45), 30, rowHeight + 5)

    rowHeight += 20
    index++
  }

  // index-name divisor line
  doc
    .lineCap('butt')
    .moveTo(30, 340)
    .lineTo(30, rowHeight)
    .stroke()

  // name-signature divisor line
  doc
    .lineCap('butt')
    .moveTo(360, 320)
    .lineTo(360, rowHeight)
    .stroke()

  doc
    .font('Times-Roman')
    .fontSize(12)
    .text(`Belém, ${dia} de ${mes} de ${ano}.`, 100, 660, {
      align: 'right'
    })
}

function textInRow(doc, text, width, heigth, options = {}) {
  if (options.hasOwnProperty('bold')) doc.font('Times-Bold')
  doc.y = heigth
  doc.x = width
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
    .rect(10, heigth, 581, 20)
    .stroke()
}
