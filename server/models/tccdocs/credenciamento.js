module.exports = function model(
  doc,
  {
    tituloDiretor,
    curso,
    nomeDosAlunos,
    matricula,
    membroConvidado,
    tituloOrientador,
    orientador,
    dia,
    mes,
    ano,
    diretor
  }
) {
  doc
    .font('Times-Bold')
    .fontSize(15)
    .text(`REQUERIMENTO DE CREDENCIAMENTO PARA PARTICIPAÇÃO DE BANCA`, 80, 50, {
      align: 'center'
    })

  doc
    .fontSize(12)
    .text(
      `Para o diretor(a) da Faculdade de Computação da Universidade Federal do Pará, ${tituloDiretor}(a) ${diretor}`,
      50,
      100,
      {
        align: 'justify'
      }
    )

  doc
    .fontSize(12)
    .text(
      `De acordo com o Art. 94 do Regulamento da Graduação desta Universidade, solicito o credenciamento para participação de bancas de defesa de Trabalhos de Conclusão de Curso. Informo o convite recebido pelo(a) professor(a) ${tituloOrientador} ${orientador}, para compor a banca de defesa do aluno concluinte do Curso de Bacharelado em ${curso}, ${nomeDosAlunos}, matrícula ${matricula}}.`,
      50,
      140,
      {
        align: 'justify'
      }
    )

  doc.fontSize(12).text(`Nestes termos, peço deferimento.`, 100, 210, {
    align: 'left'
  })

  doc.fontSize(12).text(`Belém, ${dia} de ${mes} de ${ano}.`, 100, 240, {
    align: 'left'
  })

  doc.fontSize(12).text(`____________________________________`, 80, 300, {
    align: 'center'
  })

  doc.fontSize(12).text(
    `${membroConvidado}\n
      (Membro convidado)`,
    70,
    320,
    {
      align: 'center'
    }
  )

  doc.fontSize(12).text(`____________________________________`, 80, 400, {
    align: 'center'
  })

  doc.fontSize(12).text(
    `${tituloOrientador} ${orientador}\n
       (Orientador(a))`,
    70,
    420,
    {
      align: 'center'
    }
  )

  doc.fontSize(12).text(
    `Art. 94. O TCC será defendido em sessão pública, perante banca examinadora  constituída  de,  no  mínimo,  dois  membros,  sendo  um  deles,  obrigatoriamente,  o orientador, que presidirá a sessão.\n
       § 1° A  sessão  pública  será  organizada  pela  Faculdade  ou  Escola  e  realizada durante o período letivo.\n
       § 2° A  composição  da  banca  examinadora  e  seu  suplente  deverá  ser  proposta pelo orientador, de acordo com a temática do TCC, em acordo com o discente.\n
       § 3° O Conselho da Faculdade ou Escola poderá credenciar membros externos à subunidade   acadêmica,   ou   mesmo   à   Instituição,   caso   necessário,   para   fins   de composição de banca.`,
    50,
    520,
    {
      align: 'justify'
    }
  )

  // Finalize PDF file
  return doc
}
