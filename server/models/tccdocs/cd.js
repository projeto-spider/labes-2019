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
  doc.addPage({
    layout: 'landscape'
  })

  // Dash recorte
  doc
    .rect(0, 0, 697.14, 348.57)
    .dash(5, { space: 10 })
    .stroke()

  // Header
  doc.image('./server/models/tccdocs/img/logoUFPA.png', 180, 30, {
    align: 'left',
    valign: 'top'
  })
  doc.fontSize(10).text(
    `
        UNIVERSIDADE FEDERAL DO PARÁ
        INSTITUTO DE CIÊNCIAS EXATAS E NATURAIS
        FACULDADE DE COMPUTAÇÃO
        CURSO DE BACHARELADO EM ${curso.toUpperCase()}
        `,
    -300,
    100,
    {
      align: 'center'
    }
  )
  // End of Header

  doc
    .font('Times-Bold')
    .fontSize(10)
    .text(`${tituloTCC}`, 190, 180, {
      align: 'left'
    })

  doc
    .font('Times-Bold')
    .fontSize(10)
    .text(`${nomeDosAlunos}`, 130, 205, {
      align: 'left'
    })

  doc
    .fontSize(10)
    .text(`Orientador: ${tituloOrientador} ${orientador}`, 100, 270, {
      align: 'left'
    })

  doc
    .fontSize(10)
    .text(`Co-Orientador: ${tituloCoOrientador} ${coOrientador}`, 100, 290, {
      align: 'left'
    })

  doc.fontSize(10).text(`Belem, ${ano}`, -300, 330, {
    align: 'center'
  })

  doc
    .font('Times-Bold')
    .fontSize(12)
    .text(`${tituloTCC}`, 530, 40)

  doc
    .font('Times-Bold')
    .fontSize(10)
    .text(`${nomeDosAlunos}`, 470, 80)

  doc.fontSize(9).text(
    `Declaro que este CD-ROM contém o trabalho de conclusão corrigido e
finalizado conforme minha orientação.`, // Manter colado desse jeito, para que não haja indentação no texto.
    420,
    150
  )

  doc.fontSize(10).text(`____________________________________`, 450, 250)

  doc.fontSize(10).text(`${tituloOrientador} ${orientador}`, 450, 270)

  doc.fontSize(12).text(
    `Deve ser entregue na secretaria da faculdade, já com a assinatura do seu Orientador.

  Em caso de rasura, ou quaisquer formas de deterioração deste papel, por favor, trocar na secretaria.`,
    100,
    450
  )

  return doc
}
