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
  doc
    .rect(0, 0, 697.14, 348.57)
    .dash(5, { space: 10 })
    .stroke()
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
  doc
    .font('Times-Bold')
    .fontSize(10)
    .text(`${tituloTCC}`, -300, 180, {
      align: 'center'
    })
  doc
    .font('Times-Bold')
    .fontSize(10)
    .text(`${nomeDosAlunos}`, -300, 205, {
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
  doc.fontSize(10).text(`Belém, ${ano}`, -300, 330, {
    align: 'center'
  })
  doc
    .font('Times-Bold')
    .fontSize(12)
    .text(`${tituloTCC}`, 330, 40, {
      align: 'center'
    })
  doc
    .font('Times-Bold')
    .fontSize(10)
    .text(`${nomeDosAlunos}`, 330, 80, {
      align: 'center'
    })
  doc
    .fontSize(9)
    .text(
      `Declaro que este CD-ROM contém o trabalho de conclusão corrigido e finalizado conforme minha orientação.`,
      420,
      150
    )
  doc.fontSize(10).text(`____________________________________`, 450, 250)
  doc.fontSize(10).text(`${tituloOrientador}${orientador}`, 470, 270)
  doc
    .fontSize(12)
    .text(
      `Deve ser entregue na secretaria da faculdade, já com a assinatura do seu Orientador(a).\n\nEm caso de rasura, ou quaisquer formas de deterioração deste papel, por favor, trocar na secretaria.`,
      100,
      450
    )
}
