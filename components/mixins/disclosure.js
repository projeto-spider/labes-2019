export const disclosureModel = {
  methods: {
    disclosureModel(selectedDefense) {
      function bankTitle(title) {
        if (title === 'doctor') {
          return 'Doutor(a)'
        } else if (title === 'master') {
          return 'Mestre(a)'
        } else {
          return ''
        }
      }
      return `
DEFESA PÚBLICA DO TRABALHO DE
CONCLUSÃO DO CURSO DE ${
        selectedDefense.course === 'cbcc'
          ? 'CIÊNCIA DA COMPUTAÇÃO'
          : 'SISTEMAS DE INFORMAÇÃO'
      }

Discente(s): ${selectedDefense.students}

Título: ${selectedDefense.title}

Banca:

${bankTitle(selectedDefense.advisorTitle)} ${
        selectedDefense.advisorName
      } (ORIENTADOR(A))
${bankTitle(selectedDefense.coAdvisorTitle)} ${
        selectedDefense.coAdvisorName !== ''
          ? `${selectedDefense.coAdvisorName} (COORIENTADOR(A))`
          : ''
      }
${bankTitle(selectedDefense.evaluator1Title)} ${
        selectedDefense.evaluator1Name
      } (AVALIADOR(A))
${bankTitle(selectedDefense.evaluator2Title)} ${
        selectedDefense.evaluator2Name
      } (AVALIADOR(A))
${bankTitle(selectedDefense.evaluator2Title)} ${
        selectedDefense.evaluator3Name !== ''
          ? `${selectedDefense.evaluator3Name} (AVALIADOR(A))`
          : ''
      }

Data e local: ${selectedDefense.date} às ${selectedDefense.time} - ${
        selectedDefense.local
      }

RESUMO

${selectedDefense.summary}
              `
    }
  }
}
