<template>
  <div class="card">
    <div class="card-header">
      <p class="card-header-title">
        Importar Alunos
      </p>
    </div>
    <div class="card-content">
      <b-field class="file">
        <b-upload v-model="studentsCsv" @input="validateUpload">
          <a class="button is-primary">
            <b-icon icon="upload"></b-icon>
            <span>Selecione um arquivo</span>
          </a>
        </b-upload>
        <span v-if="studentsCsv" class="file-name">
          {{ studentsCsv.name }}
        </span>
        <button
          class="button is-primary"
          :disabled="!studentsCsv || hasErrors"
          @click="uploadCsv"
        >
          Submeter
        </button>
      </b-field>
      <b-loading
        :is-full-page="true"
        :active.sync="isLoading"
        :can-cancel="false"
      ></b-loading>
    </div>
  </div>
</template>

<script>
import errors from '../shared/errors.js'
export default {
  name: 'ImportStudents',
  data() {
    return {
      studentsCsv: File,
      hasErrors: false,
      isLoading: false
    }
  },
  methods: {
    validateUpload() {
      if (this.studentsCsv.name.split('.').pop() === 'csv') {
        const reader = new FileReader()
        reader.readAsText(this.studentsCsv)
        reader.onload = e => {
          const validation = this.validateCsv(reader.result)
          if (typeof validation === 'string') {
            this.openErrorNotification(this.errorMessage(validation))
            this.studentsCsv = File
            this.hasErrors = true
          }
        }
      } else {
        this.openErrorNotification('Por favor selecione um arquivo do tipo csv')
        this.studentsCsv = File
        this.hasErrors = true
      }
    },
    validateCsv(csv) {
      const validHeader =
        'Matrícula,AnoIngresso,Nome,CPF,DataNascimento,NomeMae,Municipio,Curso,Status'
      csv = csv.replace('\r\n', '\n')

      try {
        const lines = csv.split('\n')
        if (lines.length < 2) {
          return errors.IMPORT_CSV_INVALID_LENGTH
        }

        if (lines[0] !== validHeader) {
          return errors.IMPORT_CSV_INVALID_HEADER
        }

        const rightNumberOfColumns = lines.every(
          line => line.split(',').length === 9
        )

        if (!rightNumberOfColumns) {
          return errors.IMPORT_CSV_INVALID_COL_NUMBER
        }

        return true
      } catch (err) {
        return errors.IMPORT_CSV_INVALID_FILE
      }
    },
    errorMessage(errorCode) {
      switch (errorCode) {
        case 'IMPORT_CSV_INVALID_LENGHT':
          return 'Arquivo csv com tamanho de linha invalido'
        case 'IMPORT_CSV_INVALID_HEADER':
          return 'Arquivo csv com nome de cabecalho invalido'
        case 'IMPORT_CSV_INVALID_COL_NUMBER':
          return 'Arquivo csv com numero invalido de colunas'
        case 'IMPORT_CSV_INVALID_FILE':
          return 'Por favor selecione um arquivo do tipo csv'
      }
    },
    openErrorNotification(errorMessage) {
      this.$notification.open({
        duration: 5000,
        message: errorMessage,
        position: 'is-top',
        type: 'is-danger',
        hasIcon: true
      })
    },
    uploadCsv() {
      this.isLoading = true
      const body = new FormData()
      body.append('csv', this.studentsCsv)
      this.$axios
        .post('/api/students/from-csv', body)
        .then(result => {
          this.isLoading = false
          this.$toast.open({
            message: 'Upload feito com sucesso',
            type: 'is-sucess'
          })
        })
        .catch(error => {
          this.isLoading = false
          this.$toast.open({
            message: this.errorMessage(error.response.data.code),
            type: 'is-danger'
          })
        })
    }
  }
}
</script>

<style></style>
