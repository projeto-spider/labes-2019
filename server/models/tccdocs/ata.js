module.exports = function model(
  doc,
  {
    tituloTCC,
    diaDefesa,
    mesDefesa,
    anoDefesa,
    salaDefesa,
    horarioDefesa,
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
    curso,
    discente
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
      `ATA DA DEFESA PÚBLICA DO TRABALHO DE CONCLUSÃO DO CURSO DE ${curso.toUpperCase()} REALIZADO PELO(A) DISCENTE ${discente.toUpperCase()}.`,
      80,
      200,
      {
        align: 'center'
      }
    )

  doc
    .fontSize(12)
    .text(
      `Realizou-se na ${salaDefesa}, do Campus Básico da Universidade Federal do Pará, situado no Bairro do Guamá, nesta cidade de Belém do Pará, a sessão de Defesa Pública do Trabalho de Conclusão de Curso intitulado '${tituloTCC}', apresentado pelo(a) discente ${discente.toUpperCase()}. A sessão foi instalada às ${horarioDefesa} h pelo(a)${tituloOrientador} ${orientador}. A referida banca foi constituída pelos seguintes membros:${tituloOrientador} ${orientador} (ORIENTADOR(A)) ${
        /*, */ tituloCoOrientador
      }${coOrientador} (COORIENTADOR(A)) ${
        /*, */ tituloAvaliador1
      } ${avaliador1} (AVALIADOR(A))${tituloAvaliador2} ${avaliador2} (AVALIADOR(A)) ${tituloAvaliador3} ${avaliador3} (AVALIADOR(A)). A Banca Examinadora, após a exposição do mencionado Trabalho pelo discente, passou a arguí-lo. E nada mais havendo a tratar, o presidente deu por encerrada a Defesa do Trabalho, agradecendo a presença de todos, e para constar a legitimidade do que foi deliberado, lavrou-se a presente ata que após lida, será assinada pelos membros presentes na reunião. Belém, ${diaDefesa} de ${mesDefesa} de ${anoDefesa}.`,
      20,
      300,
      {
        align: 'justify'
      }
    )

  doc.fontSize(12).text(`Conceito:`, 30, 520, {
    align: 'left'
  })

  doc.image('./server/models/tccdocs/img/checkbox.png', 90, 520, {
    align: 'right',
    valign: 'top'
  })

  doc.fontSize(10).text(`____________________________________`, 30, 600)

  doc.fontSize(10).text(
    `${tituloOrientador} ${orientador}
    ORIENTADOR(A)`,
    60,
    620
  )

  doc.fontSize(10).text(`____________________________________`, 30, 670)

  doc.fontSize(10).text(
    `${tituloCoOrientador} ${coOrientador}
    CO-ORIENTADOR(A)`,
    60,
    690
  )

  doc.fontSize(10).text(`____________________________________`, 350, 530)

  doc.fontSize(10).text(
    `${tituloAvaliador3} ${avaliador3}
AVALIADOR(A)`,
    380,
    550
  )

  doc.fontSize(10).text(`____________________________________`, 350, 600)

  doc.fontSize(10).text(
    `${tituloAvaliador1} ${avaliador1}
AVALIADOR(A)`,
    380,
    620
  )

  doc.fontSize(10).text(`____________________________________`, 350, 670)

  doc.fontSize(10).text(
    `${tituloAvaliador2} ${avaliador2}
AVALIADOR(A)`,
    380,
    690
  )
}
