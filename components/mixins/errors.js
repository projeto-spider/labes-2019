export const errorsHandler = {
  methods: {
    errorMessage(errorCode) {
      const { errors } = process.env
      switch (errorCode) {
        case errors.IMPORT_CSV_INVALID_LENGTH:
          return 'Arquivo csv com tamanho de linha invalido'
        case errors.IMPORT_CSV_INVALID_HEADER:
          return 'Arquivo csv com nome de cabecalho invalido'
        case errors.IMPORT_CSV_INVALID_COL_NUMBER:
          return 'Arquivo csv com numero invalido de colunas'
        case errors.IMPORT_CSV_INVALID_FILE:
          return 'Por favor selecione um arquivo do tipo csv'
        case errors.INVALID_REQUEST:
          return 'Campo `nome` ou `email` não fornecidos'
        case errors.UNPROCESSABLE_ENTITY:
          return 'Campo `e-mail` duplicado ou `matrícula` inválida.'
        default:
          return 'Ocorreu um erro'
      }
    },

    openErrorNotification(errorMessage) {
      this.$notification.open({
        duration: 5000,
        message: this.errorMessage(errorMessage),
        position: 'is-top',
        type: 'is-danger',
        hasIcon: true
      })
    }
  }
}
