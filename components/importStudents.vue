<template>
  <div class="card">
    <div class="card-header">
      <p class="card-header-title">
        Importar Alunos
      </p>
    </div>
    <div class="card-content">
      <p class="title">
        Importar alunos (SIGAA)
      </p>
      <p class="subtitle">Curso: {{ course }}</p>
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
          :disabled="toggleUpload"
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
import { errorsHandler } from './mixins/errors'
export default {
  name: 'ImportStudents',
  mixins: [errorsHandler],
  data() {
    return {
      studentsCsv: new File([''], 'Nenhum arquivo selecionado'),
      course: 'Selecione um arquivo',
      hasErrors: false,
      isLoading: false
    }
  },
  computed: {
    toggleUpload() {
      return this.hasErrors || !this.fileSelected()
    }
  },
  watch: {
    studentsCsv() {
      const reader = new FileReader()
      let csv = File
      if (this.fileSelected()) {
        reader.readAsText(this.studentsCsv)
        reader.onload = e => {
          csv = reader.result

          csv = csv.replace('\r\n', '\n')
          const lines = csv.split('\n')
          const col = lines[1].split(',')
          this.course = col[7]
        }
      }
    }
  },
  methods: {
    fileSelected() {
      return this.studentsCsv.name !== 'Nenhum arquivo selecionado'
    },
    validateUpload() {
      if (this.studentsCsv.name.split('.').pop() === 'csv') {
        const reader = new FileReader()
        reader.readAsText(this.studentsCsv)
        reader.onload = e => {
          const validation = this.validateCsv(reader.result)
          if (typeof validation === 'string') {
            this.openErrorNotification(validation)
            this.studentsCsv = new File([''], 'Nenhum arquivo selecionado')
            this.hasErrors = true
          } else this.hasErrors = false
        }
      } else {
        this.openErrorNotification(process.env.errors.IMPORT_CSV_INVALID_FILE)
        this.studentsCsv = new File([''], 'Nenhum arquivo selecionado')
        this.hasErrors = true
      }
    },
    validateCsv(csv) {
      const validHeader =
        'Matrícula,AnoIngresso,Nome,CPF,DataNascimento,NomeMae,Municipio,Curso,Status'
      const { errors } = process.env
      csv = csv.replace('\r\n', '\n')

      try {
        const lines = csv.split('\n')
        if (!lines[lines.length - 1]) {
          lines.splice(-1, 1)
        }

        if (lines.length < 2) {
          return errors.IMPORT_CSV_INVALID_LENGTH
        }

        if (lines[0] !== validHeader) {
          return errors.IMPORT_CSV_INVALID_HEADER
        }

        const rightNumberOfColumns = lines.every(line => {
          const arr = line.split(',')
          return arr.length === 9
        })

        if (!rightNumberOfColumns) {
          return errors.IMPORT_CSV_INVALID_COL_NUMBER
        }

        return true
      } catch (err) {
        return errors.IMPORT_CSV_INVALID_FILE
      }
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
            type: 'is-success'
          })
          this.$parent.close()
        })
        .catch(error => {
          this.isLoading = false
          this.openErrorNotification(error.response.data.code)
        })
    }
  }
}
</script>

<style></style>
