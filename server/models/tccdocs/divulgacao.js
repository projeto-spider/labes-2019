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
  doc.image('./server/models/tccdocs/img/logoFacomp.png', 50, 35, {
    width: 76,
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
      0,
      40,
      {
        align: 'center'
      }
    )
  doc.image('./server/models/tccdocs/img/logoUFPA.png', 480, 35, {
    width: 70,
    height: 80,
    align: 'right',
    valign: 'top'
  })
  doc
    .font('Times-Bold')
    .fontSize(15)
    .text(
      `DEFESA PÚBLICA DO TRABALHO DE CONCLUSÃO DO CURSO DE ${curso.toUpperCase()}`,
      28,
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
  doc
    .fontSize(12)
    .text(
      `${tituloOrientador}${orientador} (Orientador(a))\n${
        coOrientador
          ? `${tituloCoOrientador}${coOrientador} (Co-Orientador(a))\n`
          : ``
      }${tituloAvaliador1}${avaliador1} (Avaliador(a))\n${tituloAvaliador2}${avaliador2} (Avaliador(a))\n${
        avaliador3 ? `${tituloAvaliador3}${avaliador3} (Avaliador(a))\n` : ``
      }`,
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
    .text(`Resumo`, 22, 450, {
      align: 'center'
    })
  doc.fontSize(12).text(`${resumo}`, 22, 480, {
    align: 'center'
  })
}
