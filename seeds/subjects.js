const Subject = require('../server/models/Subject')

exports.seed = async function(knex, Promise) {
  // Deletes ALL existing entries
  await knex('subjects').del()

  const data = [
    {
      name: 'ALGEBRA LINEAR PARA COMPUTACAO',
      code: 'EN01208'
    },
    {
      name: 'CALCULO COMPUTACIONAL I',
      code: 'EN01209'
    },
    {
      name: 'FISICA PARA COMPUTACAO',
      code: 'EN02196'
    },
    {
      name: 'ALGORITMOS',
      code: 'EN05209'
    },
    {
      name: 'SISTEMAS DE COMPUTACAO',
      code: 'EN05210'
    },
    {
      name: 'LABORATORIO DE SISTEMAS DE COMPUTACAO',
      code: 'EN05211'
    },
    {
      name: 'CALCULO COMPUTACIONAL II',
      code: 'EN01205'
    },
    {
      name: 'MATEMATICA DISCRETA PARA COMPUTACAO',
      code: 'EN01210'
    },
    {
      name: 'PROGRAMACAO DE COMPUTADORES I',
      code: 'EN05168'
    },
    {
      name: 'METODOLOGIA DE TRABALHO CIENTIFICO EM COMPUTACAO',
      code: 'EN05212'
    },
    {
      name: 'PROBABILIDADE E ESTATISTICA',
      code: 'EN07051'
    },
    {
      name: 'FILOSOFIA DAS CIENCIAS',
      code: 'FH01181'
    },
    {
      name: 'SOCIOLOGIA APLICADA A INFORMATICA',
      code: 'FH02086'
    },
    {
      name: 'MATEMATICA CONCRETA',
      code: 'EN01211'
    },
    {
      name: 'SISTEMAS OPERACIONAIS',
      code: 'EN05177'
    },
    {
      name: 'LABORATORIO DE SISTEMAS OPERACIONAIS',
      code: 'EN05213'
    },
    {
      name: 'PROJETO DE ALGORITIMOS I',
      code: 'EN05214'
    },
    {
      name: 'LINGUAGENS FORMAIS, AUTOMATOS E COMPUTABILIDADE',
      code: 'EN05215'
    },
    {
      name: 'PSICOLOGIA APLICADA A INFORMATICA',
      code: 'FH05090'
    },
    {
      name: 'ANALISE DE ALGORITIMOS',
      code: 'EN05174'
    },
    {
      name: 'PROJETO DE ALGORITMOS II',
      code: 'EN05217'
    },
    {
      name: 'PROGRAMACAO EM LOGICA',
      code: 'EN05218'
    },
    {
      name: 'PROGRAMACAO II',
      code: 'EN05219'
    },
    {
      name: 'ELEMENTOS DE DIREITO',
      code: 'EN05230'
    },
    {
      name: 'MATEMATICA COMPUTACIONAL I',
      code: 'EN05264'
    },
    {
      name: 'GRAFOS',
      code: 'EN05173'
    },
    {
      name: 'BANCO DE DADOS I',
      code: 'EN05175'
    },
    {
      name: 'ENGENHARIA DE SOFTWARE',
      code: 'EN05176'
    },
    {
      name: 'INTELIGENCIA ARTIFICIAL',
      code: 'EN05187'
    },
    {
      name: 'PARADIGMAS DE LINGUAGENS DE PROGRAMACAO',
      code: 'EN05216'
    },
    {
      name: 'FUNDAMENTOS DE COMUNICACAO DIGITAL',
      code: 'EN05220'
    },
    {
      name: 'REDES DE COMPUTADORES',
      code: 'EN05180'
    },
    {
      name: 'BANCO DE DADOS II',
      code: 'EN05181'
    },
    {
      name: 'ESTAGIO SUPERVISIONADO',
      code: 'EN05189'
    },
    {
      name: 'ANALISE E PROJETO DE SOFTWARE',
      code: 'EN05221'
    },
    {
      name: 'ELEMENTOS DE GERENCIA DE PROJETOS DE SOFTWARE',
      code: 'EN05222'
    },
    {
      name: 'EMPREENDEDORISMO EM INFORMATICA',
      code: 'EN05231'
    },
    {
      name: 'EDUCACAO AMBIENTAL',
      code: 'EN05232'
    },
    {
      name: 'INTERACAO HUMANO-COMPUTADOR',
      code: 'EN05178'
    },
    {
      name: 'TOPICOS ESPECIAIS EM SISTEMAS DE INFORMACAO I',
      code: 'EN05186'
    },
    {
      name: 'TOPICOS ESPECIAIS EM SISTEMAS DISTRIBUIDOS I',
      code: 'EN05190'
    },
    {
      name: 'INFORMATICA NA EDUCACAO I',
      code: 'EN05196'
    },
    {
      name: 'SISTEMAS MULTIAGENTES',
      code: 'EN05201'
    },
    {
      name: 'TOPICOS ESPECIAIS EM BANCO DE DADOS I',
      code: 'EN05205'
    },
    {
      name: 'TOPICOS ESPECIAIS EM ENGENHARIA DE SOFTWARE I',
      code: 'EN05206'
    },
    {
      name: 'TOPICOS ESPECIAIS EM REDES DE COMPUTADORES I',
      code: 'EN05207'
    },
    {
      name: 'TOPICOS ESPECIAIS EM SISTEMAS DE INFORMACAO II',
      code: 'EN05208'
    },
    {
      name: 'COMPILADORES',
      code: 'EN05235'
    },
    {
      name: 'CONTROLE DE PROCESSOS',
      code: 'EN05236'
    },
    {
      name: 'CONTROLE E GARANTIA DE QUALIDADE DE SOFTWARE',
      code: 'EN05237'
    },
    {
      name: 'INFORMATICA DA EDUCACAO II',
      code: 'EN05238'
    },
    {
      name: 'INGLES TECNICO PARA COMPUTACAO',
      code: 'EN05239'
    },
    {
      name: 'PROCESSAMENTO DE IMAGENS',
      code: 'EN05240'
    },
    {
      name: 'PROGRAMACAO PARALELA E DISTRIBUIDA',
      code: 'EN05241'
    },
    {
      name: 'SISTEMAS DE INFORMACAO GEOGRAFICA',
      code: 'EN05242'
    },
    {
      name: 'SISTEMAS MULTIAGENTES',
      code: 'EN05243'
    },
    {
      name: 'TEORIA DAS CATEGORIAS',
      code: 'EN05244'
    },
    {
      name: 'TOPICOS ESPECIAIS EM ARQUITETURA DE COMPUTADORES',
      code: 'EN05245'
    },
    {
      name: 'TOPICOS ESPECIAIS EM BANCO DE DADOS II',
      code: 'EN05246'
    },
    {
      name: 'TOPICOS ESPECIAIS EM COMPUTACAO GRAFICA',
      code: 'EN05247'
    },
    {
      name: 'TOPICOS ESPECIAIS EM COMPUTACAO I',
      code: 'EN05248'
    },
    {
      name: 'TOPICOS ESPECIAIS EM COMPUTACAO II',
      code: 'EN05249'
    },
    {
      name: 'TOPICOS ESPECIAIS EM ENGENHARIA DE SOFTWARE II',
      code: 'EN05250'
    },
    {
      name: 'TOPICOS ESPECIAIS EM INTELIGENCIA ARTIFICIAL I',
      code: 'EN05251'
    },
    {
      name: 'TOPICOS ESPECIAIS EM INTELIGENCIA ARTIFICIAL II',
      code: 'EN05252'
    },
    {
      name: 'TOPICOS ESPECIAIS EM REDES DE COMPUTADORES II',
      code: 'EN05253'
    },
    {
      name: 'TOPICOS ESPECIAIS EM SISTEMAS DISTRIBUIDOS II',
      code: 'EN05254'
    },
    {
      name: 'COMPUTACAO GRAFICA',
      code: 'EN05182'
    },
    {
      name: 'TRABALHO DE CONCLUSAO DE CURSO I',
      code: 'EN05188'
    },
    {
      name: 'LABORATORIO DE REDES DE COMPUTADORES',
      code: 'EN05223'
    },
    {
      name: 'SIMULACAO DISCRETA',
      code: 'EN05225'
    },
    {
      name: 'LABORATORIO DE ENGENHARIA DE SOFTWARE',
      code: 'EN05226'
    },
    {
      name: 'ADMINISTRACAO DA INFORMATICA',
      code: 'EN05233'
    },
    {
      name: 'TRABALHO DE CONCLUSAO DE CURSO II',
      code: 'EN05195'
    },
    {
      name: 'SISTEMAS DISTRIBUIDOS',
      code: 'EN05227'
    },
    {
      name: 'REDES MULTIMIDIA',
      code: 'EN05228'
    },
    {
      name: 'LABORATORIO DE SISTEMAS DISTRIBUIDOS',
      code: 'EN05229'
    },
    {
      name: 'INFORMATICA E SOCIEDADE',
      code: 'EN05234'
    },
    {
      name: 'ATIVIDADE COMPLEMENTAR I',
      code: 'EN05255'
    },
    {
      name: 'ATIVIDADE COMPLEMENTAR II',
      code: 'EN05256'
    },
    {
      name: 'ATIVIDADE COMPLEMENTAR III',
      code: 'EN05257'
    },
    {
      name: 'ATIVIDADE COMPLEMENTAR IV',
      code: 'EN05258'
    },
    {
      name: 'ATIVIDADE COMPLEMENTAR V',
      code: 'EN05259'
    },
    {
      name: 'ATIVIDADE COMPLEMENTAR VI',
      code: 'EN05260'
    },
    {
      name: 'ATIVIDADE COMPLEMENTAR VII',
      code: 'EN05261'
    }
  ]

  return Promise.all(data.map(subject => Subject.forge(subject).save()))
}
