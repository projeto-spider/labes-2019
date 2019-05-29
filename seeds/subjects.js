const Subject = require('../server/models/Subject')

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('subjects').del()

  const data = [
    {
      name: 'ALGEBRA LINEAR PARA COMPUTACAO'
    },
    {
      name: 'CALCULO COMPUTACIONAL I'
    },
    {
      name: 'FISICA PARA COMPUTACAO'
    },
    {
      name: 'ALGORITMOS'
    },
    {
      name: 'SISTEMAS DE COMPUTACAO'
    },
    {
      name: 'LABORATORIO DE SISTEMAS DE COMPUTACAO'
    },
    {
      name: 'CALCULO COMPUTACIONAL II'
    },
    {
      name: 'MATEMATICA DISCRETA PARA COMPUTACAO'
    },
    {
      name: 'PROGRAMACAO DE COMPUTADORES I'
    },
    {
      name: 'METODOLOGIA DE TRABALHO CIENTIFICO EM COMPUTACAO'
    },
    {
      name: 'PROBABILIDADE E ESTATISTICA'
    },
    {
      name: 'FILOSOFIA DAS CIENCIAS'
    },
    {
      name: 'SOCIOLOGIA APLICADA A INFORMATICA'
    },
    {
      name: 'MATEMATICA CONCRETA'
    },
    {
      name: 'SISTEMAS OPERACIONAIS'
    },
    {
      name: 'LABORATORIO DE SISTEMAS OPERACIONAIS'
    },
    {
      name: 'PROJETO DE ALGORITIMOS I'
    },
    {
      name: 'LINGUAGENS FORMAIS, AUTOMATOS E COMPUTABILIDADE'
    },
    {
      name: 'PSICOLOGIA APLICADA A INFORMATICA'
    },
    {
      name: 'ANALISE DE ALGORITIMOS'
    },
    {
      name: 'PROJETO DE ALGORITMOS II'
    },
    {
      name: 'PROGRAMACAO EM LOGICA'
    },
    {
      name: 'PROGRAMACAO II'
    },
    {
      name: 'ELEMENTOS DE DIREITO'
    },
    {
      name: 'MATEMATICA COMPUTACIONAL I'
    },
    {
      name: 'GRAFOS'
    },
    {
      name: 'BANCO DE DADOS I'
    },
    {
      name: 'ENGENHARIA DE SOFTWARE'
    },
    {
      name: 'INTELIGENCIA ARTIFICIAL'
    },
    {
      name: 'PARADIGMAS DE LINGUAGENS DE PROGRAMACAO'
    },
    {
      name: 'FUNDAMENTOS DE COMUNICACAO DIGITAL'
    },
    {
      name: 'REDES DE COMPUTADORES'
    },
    {
      name: 'BANCO DE DADOS II'
    },
    {
      name: 'ESTAGIO SUPERVISIONADO'
    },
    {
      name: 'ANALISE E PROJETO DE SOFTWARE'
    },
    {
      name: 'ELEMENTOS DE GERENCIA DE PROJETOS DE SOFTWARE'
    },
    {
      name: 'EMPREENDEDORISMO EM INFORMATICA'
    },
    {
      name: 'EDUCACAO AMBIENTAL'
    },
    {
      name: 'INTERACAO HUMANO-COMPUTADOR'
    },
    {
      name: 'TOPICOS ESPECIAIS EM SISTEMAS DE INFORMACAO I'
    },
    {
      name: 'TOPICOS ESPECIAIS EM SISTEMAS DISTRIBUIDOS I'
    },
    {
      name: 'INFORMATICA NA EDUCACAO I'
    },
    {
      name: 'SISTEMAS MULTIAGENTES'
    },
    {
      name: 'TOPICOS ESPECIAIS EM BANCO DE DADOS I'
    },
    {
      name: 'TOPICOS ESPECIAIS EM ENGENHARIA DE SOFTWARE I'
    },
    {
      name: 'TOPICOS ESPECIAIS EM REDES DE COMPUTADORES I'
    },
    {
      name: 'TOPICOS ESPECIAIS EM SISTEMAS DE INFORMACAO II'
    },
    {
      name: 'COMPILADORES'
    },
    {
      name: 'CONTROLE DE PROCESSOS'
    },
    {
      name: 'CONTROLE E GARANTIA DE QUALIDADE DE SOFTWARE'
    },
    {
      name: 'INFORMATICA DA EDUCACAO II'
    },
    {
      name: 'INGLES TECNICO PARA COMPUTACAO'
    },
    {
      name: 'PROCESSAMENTO DE IMAGENS'
    },
    {
      name: 'PROGRAMACAO PARALELA E DISTRIBUIDA'
    },
    {
      name: 'SISTEMAS DE INFORMACAO GEOGRAFICA'
    },
    {
      name: 'SISTEMAS MULTIAGENTES'
    },
    {
      name: 'TEORIA DAS CATEGORIAS'
    },
    {
      name: 'TOPICOS ESPECIAIS EM ARQUITETURA DE COMPUTADORES'
    },
    {
      name: 'TOPICOS ESPECIAIS EM BANCO DE DADOS II'
    },
    {
      name: 'TOPICOS ESPECIAIS EM COMPUTACAO GRAFICA'
    },
    {
      name: 'TOPICOS ESPECIAIS EM COMPUTACAO I'
    },
    {
      name: 'TOPICOS ESPECIAIS EM COMPUTACAO II'
    },
    {
      name: 'TOPICOS ESPECIAIS EM ENGENHARIA DE SOFTWARE II'
    },
    {
      name: 'TOPICOS ESPECIAIS EM INTELIGENCIA ARTIFICIAL I'
    },
    {
      name: 'TOPICOS ESPECIAIS EM INTELIGENCIA ARTIFICIAL II'
    },
    {
      name: 'TOPICOS ESPECIAIS EM REDES DE COMPUTADORES II'
    },
    {
      name: 'TOPICOS ESPECIAIS EM SISTEMAS DISTRIBUIDOS II'
    },
    {
      name: 'COMPUTACAO GRAFICA'
    },
    {
      name: 'TRABALHO DE CONCLUSAO DE CURSO I'
    },
    {
      name: 'LABORATORIO DE REDES DE COMPUTADORES'
    },
    {
      name: 'SIMULACAO DISCRETA'
    },
    {
      name: 'LABORATORIO DE ENGENHARIA DE SOFTWARE'
    },
    {
      name: 'ADMINISTRACAO DA INFORMATICA'
    },
    {
      name: 'TRABALHO DE CONCLUSAO DE CURSO II'
    },
    {
      name: 'SISTEMAS DISTRIBUIDOS'
    },
    {
      name: 'REDES MULTIMIDIA'
    },
    {
      name: 'LABORATORIO DE SISTEMAS DISTRIBUIDOS'
    },
    {
      name: 'INFORMATICA E SOCIEDADE'
    },
    {
      name: 'ATIVIDADE COMPLEMENTAR I'
    },
    {
      name: 'ATIVIDADE COMPLEMENTAR II'
    },
    {
      name: 'ATIVIDADE COMPLEMENTAR III'
    },
    {
      name: 'ATIVIDADE COMPLEMENTAR IV'
    },
    {
      name: 'ATIVIDADE COMPLEMENTAR V'
    },
    {
      name: 'ATIVIDADE COMPLEMENTAR VI'
    },
    {
      name: 'ATIVIDADE COMPLEMENTAR VII'
    }
  ]

  return Promise.all(data.map(subject => Subject.forge(subject).save()))
}
