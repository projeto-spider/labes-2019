const path = require('path')

module.exports = function model(
  doc,
  {
    tituloTCC,
    diaDefesa,
    mesDefesa,
    anoDefesa,
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
    dia,
    mes,
    ano,
    diretor,
    pessoa, // orientador, co-orientador ou avaliador
    tituloPessoa,
    condicao, // pessoa
    discente,
    isDiscente,
    aprovado,
    conceito
  }
) {
  doc.image(path.join(__dirname, './img/logoFacomp.png'), 50, 35, {
    width: 76,
    height: 80,
    align: 'left',
    valign: 'top'
  })
  doc
    .font('Times-Bold')
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
  doc.image(path.join(__dirname, './img/logoUFPA.png'), 480, 35, {
    width: 70,
    height: 80,
    align: 'right',
    valign: 'top'
  })
  let trecho1 = `${tituloPessoa}${pessoa} participou na condição de ${condicao} da Banca de`
  let trecho2 = `, apresentado pelo(a) discente ${discente}`
  let trecho3 = '.'
  if (isDiscente) {
    trecho1 = `discente ${pessoa} realizou a`
    trecho2 = ''
    trecho3 = `, sendo o trabalho ${aprovado} com conceito ${conceito}.`
  }
  doc
    .font('Times-Bold')
    .fontSize(20)
    .text(`C E R T I F I C A D O`, 28, 200, {
      align: 'center'
    })
  doc
    .font('Times-Roman')
    .fontSize(12)
    .text(
      `Certificamos para os devidos fins que o(a) ${trecho1} Defesa Pública do Trabalho de Conclusão de Curso intitulado '${tituloTCC}' ${trecho2}, no dia ${diaDefesa} de ${mesDefesa} de ${anoDefesa} ${trecho3}`,
      20,
      350,
      {
        align: 'justify'
      }
    )
  doc
    .font('Times-BoldItalic')
    .fontSize(12)
    .text(`Banca:`, 100, 450, {
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
        avaliador3 ? `${tituloAvaliador3}${avaliador3} (Avaliador(a))` : ``
      }`,
      150,
      480,
      {
        align: 'left'
      }
    )
  doc.fontSize(12).text(`Belém, ${dia} de ${mes} de ${ano}.`, 100, 560, {
    align: 'right'
  })
  doc.fontSize(12).text(`____________________________________`, 22, 640, {
    align: 'center'
  })
  doc
    .fontSize(12)
    .text(`${diretor}\n\nDiretor(a) da Faculdade de Computação`, 22, 670, {
      align: 'center'
    })
}
