module.exports = function model(
  doc,
  {
    curso,
    tituloTCC,
    discente,
    palavrasChave,
    tituloOrientador,
    orientador,
    tituloCoOrientador,
    coOrientador,
    tituloAvaliador1,
    avaliador1,
    tituloAvaliador2,
    avaliador2,
    tituloAvaliador3,
    avaliador3,
    diaDefesa,
    mesDefesa,
    anoDefesa,
    horarioDefesa,
    salaDefesa,
    resumo
  }
) {
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

  doc.image('./server/models/tccdocs/img/logoUFPA.png', 500, 35, {
    align: 'right',
    valign: 'top'
  })
  // End of Header

  doc
    .font('Times-Bold')
    .fontSize(15)
    .text(
      `DEFESA PÚBLICA DO TRABALHO DE CONCLUSÃO DO CURSO DE ${curso.toUpperCase()}`,
      80,
      180,
      {
        align: 'center'
      }
    )

  doc
    .font('Times-BoldItalic')
    .fontSize(12)
    .text(`Discente:`, 100, 250, {
      align: 'left'
    })

  doc.fontSize(12).text(`${discente.toUpperCase()}`, 150, 250, {
    align: 'left'
  })

  doc
    .font('Times-BoldItalic')
    .fontSize(12)
    .text(`Título:`, 100, 280, {
      align: 'left'
    })

  doc
    .font('Times-Bold')
    .fontSize(12)
    .text(`${tituloTCC.toUpperCase()}`, 150, 280, {
      align: 'left'
    })

  doc
    .font('Times-BoldItalic')
    .fontSize(12)
    .text(`Palavras-Chave:`, 100, 310, {
      align: 'left'
    })

  doc.fontSize(12).text(`${palavrasChave}`, 190, 310, {
    align: 'left'
  })

  doc
    .font('Times-BoldItalic')
    .fontSize(12)
    .text(`Banca:`, 100, 340, {
      align: 'left'
    })

  doc.fontSize(12).text(
    `${tituloOrientador}(a) ${orientador} (Orientador(a))
${
  coOrientador
    ? `${tituloCoOrientador}(a) ${coOrientador} (Co-Orientador(a))`
    : ``
}
${tituloAvaliador1}(a) ${avaliador1} (Avaliador(a))
${tituloAvaliador2}(a) ${avaliador2} (Avaliador(a))
${avaliador3 ? `${tituloAvaliador3}(a) ${avaliador3} (Avaliador(a))` : ``}`,
    150,
    340,
    {
      align: 'left'
    }
  )

  doc
    .font('Times-BoldItalic')
    .fontSize(12)
    .text(`Data e Local:`, 100, 420, {
      align: 'left'
    })

  doc
    .fontSize(12)
    .text(
      `${diaDefesa} de ${mesDefesa} de ${anoDefesa} às ${horarioDefesa} h - ${salaDefesa}`,
      180,
      420,
      {
        align: 'left'
      }
    )

  doc
    .font('Times-Bold')
    .fontSize(12)
    .text(`Resumo`, 100, 450, {
      align: 'center'
    })

  doc.fontSize(12).text(`${resumo}`, 100, 480, {
    align: 'center'
  })
}
