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
          Atualizar
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
import { errorsHandler } from '@/components/mixins/errors'
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
      if (!this.studentsCsv) {
        return
      }
      return this.studentsCsv.name !== 'Nenhum arquivo selecionado'
    },
    validateUpload() {
      const { config } = process.env
      if (!this.studentsCsv) {
        return
      }
      if (this.studentsCsv.size >= config.MAX_FILE_SIZE) {
        this.openErrorNotification(process.env.errors.MAX_FILE_SIZE_EXCEEDED)
        this.studentsCsv = new File([''], 'Nenhum arquivo selecionado')
        this.hasErrors = true
        return
      }
      if (this.studentsCsv.name.split('.').pop() !== 'csv') {
        this.openErrorNotification(process.env.errors.IMPORT_CSV_INVALID_FILE)
        this.studentsCsv = new File([''], 'Nenhum arquivo selecionado')
        this.hasErrors = true
      }
    },
    uploadCsv() {
      this.isLoading = true
      this.$services.students
        .importFromCsv(this.studentsCsv)
        .then(result => {
          this.isLoading = false
          this.$toast.open({
            message: 'Upload feito com sucesso',
            type: 'is-success'
          })
          this.$emit('import')
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
