export const disclosureModel = {
  methods: {
    disclosureModel(selectedDefense) {
      return `
DEFESA PÚBLICA DO TRABALHO DE
CONCLUSÃO DO CURSO DE ${
        selectedDefense.course === 'cbcc'
          ? 'CIÊNCIA DA COMPUTAÇÃO'
          : 'SISTEMAS DE INFORMAÇÃO'
      }

Discente: ${selectedDefense.students}

Título: ${selectedDefense.title}

Banca:

${selectedDefense.advisorName} (ORIENTADOR(A))
${
  selectedDefense.coAdvisorName !== ''
    ? `${selectedDefense.coAdvisorName} (COORIENTADOR(A))`
    : ''
}
${selectedDefense.evaluator1Name} (AVALIADOR(A))
${selectedDefense.evaluator2Name} (AVALIADOR(A))
${
  selectedDefense.evaluator3Name !== ''
    ? `${selectedDefense.evaluator3Name} (AVALIADOR(A))`
    : ''
}

Data e local: ${selectedDefense.date} as ${selectedDefense.time} - ${
        selectedDefense.local
      }

RESUMO

${selectedDefense.summary}
              `
    }
  }
}
