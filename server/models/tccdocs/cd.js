module.exports = function model(
  doc,
  {
    curso,
    tituloTCC,
    nomeDosAlunos,
    tituloOrientador,
    orientador,
    tituloCoOrientador,
    coOrientador,
    ano
  }
) {
  doc
    .rect(0, 0, 697.14, 348.57)
    .dash(5, { space: 10 })
    .stroke()
  doc.image('./server/models/tccdocs/img/logoUFPA.png', 150, 30, {
    width: 70,
    height: 70,
    align: 'left',
    valign: 'top'
  })
  doc.fontSize(10).text(
    `\nUNIVERSIDADE FEDERAL DO PARÁ\nINSTITUTO DE CIÊNCIAS EXATAS E NATURAIS\nFACULDADE DE COMPUTAÇÃO\nCURSO DE BACHARELADO EM ${curso.toUpperCase()}
        `,
    -390,
    100,
    {
      align: 'center'
    }
  )
  doc
    .font('Times-Bold')
    .fontSize(10)
    .text(`${tituloTCC}`, -390, 180, {
      align: 'center'
    })
  doc
    .font('Times-Bold')
    .fontSize(10)
    .text(`${nomeDosAlunos}`, -390, 205, {
      align: 'center'
    })
  doc
    .fontSize(10)
    .text(`Orientador(a): ${tituloOrientador}${orientador}`, 30, 270, {
      align: 'left'
    })
  if (coOrientador) {
    doc
      .fontSize(10)
      .text(`Co-Orientador(a): ${tituloCoOrientador}${coOrientador}`, 30, 290, {
        align: 'left'
      })
  }
  doc.fontSize(10).text(`Belém, ${ano}`, -390, 330, {
    align: 'center'
  })
  doc
    .font('Times-Bold')
    .fontSize(12)
    .text(`${tituloTCC}`, 260, 40, {
      align: 'center'
    })
  doc
    .font('Times-Bold')
    .fontSize(10)
    .text(`${nomeDosAlunos}`, 260, 80, {
      align: 'center'
    })
  doc
    .fontSize(9)
    .text(
      `Declaro que este CD-ROM contém o trabalho de conclusão corrigido e finalizado conforme minha orientação.`,
      400,
      150,
      {
        width: 290
      }
    )
  doc.fontSize(10).text(`____________________________________`, 430, 250)
  doc.fontSize(10).text(`${tituloOrientador}${orientador}`, 450, 270)
  doc
    .fontSize(12)
    .text(
      `Deve ser entregue na secretaria da faculdade, já com a assinatura do seu Orientador(a).\n\nEm caso de rasura, ou quaisquer formas de deterioração deste papel, por favor, trocar na secretaria.`,
      100,
      450
    )
}
