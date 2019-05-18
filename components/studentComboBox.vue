<template>
  <div class="card">
    <header class="card-header">
      <b-icon pack="fas" icon="user" size="is-medium"></b-icon>
      <p class="card-header-title">{{ studentData.name }}</p>
    </header>
    <div class="card-content">
      <div class="content">
        <div class="columns">
          <div class="column is-half">
            <strong>Nome</strong>: {{ studentData.name }} <br />
            <strong>Matricula</strong>: {{ studentData.registrationNumber }}
            <br />
            <strong>E-mail</strong>: {{ studentData.email }} <br />
            <strong>Status</strong>: {{ displayStatus }} <br />
            <strong>CRG</strong>:
            <b-input v-model="studentData.crg" :disabled="!canEdit"></b-input>
            <br />
            <strong>Pendências</strong>:
            <b-input
              v-model="pendencies"
              :disabled="!canEdit"
              :value="studentData.pendencies"
            ></b-input>
            <br />
          </div>
          <div class="column is-half">
            <div class="box">
              <p class="title is-4">
                Documentos
              </p>
              <div class="table-container">
                <table class="table is-narrow">
                  <tbody>
                    <tr>
                      <td>
                        <strong>Ata</strong>
                      </td>
                      <td>
                        <b-checkbox
                          v-model="ataCheck"
                          :disabled="!canEdit"
                        ></b-checkbox>
                      </td>
                      <td>
                        <a
                          v-if="checkDocumentIsEmpty.ataFile"
                          :href="`${ataDocument.url}?token=${token}`"
                          target="_blank"
                        >
                          <b-icon icon="file-pdf"></b-icon>
                        </a>
                        <p v-else>
                          Sem documento
                        </p>
                      </td>
                      <td>
                        <b-upload
                          v-model="uploadFile"
                          :disabled="disableUploadAta"
                          @input="validateUpload(1)"
                        >
                          <a
                            class="button is-primary"
                            :disabled="disableUploadAta"
                          >
                            <b-icon icon="upload"></b-icon>
                          </a>
                        </b-upload>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Lauda</strong></td>
                      <td>
                        <b-checkbox
                          v-model="laudaCheck"
                          :disabled="!canEdit"
                        ></b-checkbox>
                      </td>
                      <td>
                        <a
                          v-if="checkDocumentIsEmpty.laudaFile"
                          :href="`${laudaDocument.url}?token=${token}`"
                          target="_blank"
                        >
                          <b-icon icon="file-pdf"></b-icon>
                        </a>
                        <p v-else>
                          Sem documento
                        </p>
                      </td>
                      <td>
                        <b-upload
                          v-model="uploadFile"
                          :disabled="disableUploadLauda"
                          @input="validateUpload(2)"
                        >
                          <a
                            class="button is-primary"
                            :disabled="disableUploadLauda"
                          >
                            <b-icon icon="upload"></b-icon>
                          </a>
                        </b-upload>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>CD</strong></td>
                      <td>
                        <b-checkbox
                          v-model="CdCheck"
                          :disabled="!canEdit"
                        ></b-checkbox>
                      </td>
                      <td>
                        -
                      </td>
                      <td>
                        -
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Lista presc.</strong></td>
                      <td>
                        <b-checkbox
                          v-model="presCheck"
                          :disabled="!canEdit"
                        ></b-checkbox>
                      </td>
                      <td>
                        <a
                          v-if="checkDocumentIsEmpty.presFile"
                          :href="`${presDocument.url}?token=${token}`"
                          target="_blank"
                        >
                          <b-icon icon="file-pdf"></b-icon>
                        </a>
                        <p v-else>
                          Sem documento
                        </p>
                      </td>
                      <td>
                        <b-upload
                          v-model="uploadFile"
                          :disabled="disableUploadPres"
                          @input="validateUpload(3)"
                        >
                          <a
                            class="button is-primary"
                            :disabled="disableUploadPres"
                          >
                            <b-icon icon="upload"></b-icon>
                          </a>
                        </b-upload>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="level">
        <div class="level-left">
          <div class="level-item">
            <b-field>
              <b-button class="is-primary" @click="toggleEdit">
                Editar
              </b-button>
            </b-field>
          </div>
        </div>
        <div class="level-right">
          <div class="level-item">
            <b-field>
              <b-button class="is-primary" @click="putStudents">
                Submeter</b-button
              >
            </b-field>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { errorsHandler } from './mixins/errors'
export default {
  name: 'StudentComboBox',
  mixins: [errorsHandler],
  props: {
    student: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      canEdit: false,
      ataCheck: false,
      laudaCheck: false,
      presCheck: false,
      CdCheck: false,
      ataDocument: {},
      laudaDocument: {},
      presDocument: {},
      uploadFile: File,
      crg: '',
      pendencies: '',
      studentData: Object.assign({}, this.student),
      isLoading: false
    }
  },
  computed: {
    ...mapState({
      token: state => state.auth.token
    }),
    displayStatus() {
      if (this.studentData.isActive) {
        return 'Ativo'
      } else return 'Inativo'
    },
    disableUploadAta() {
      return !this.ataCheck || !this.canEdit
    },
    disableUploadLauda() {
      return !this.laudaCheck || !this.canEdit
    },
    disableUploadPres() {
      return !this.presCheck || !this.canEdit
    },
    checkDocumentIsEmpty() {
      function check(document) {
        return (
          Object.entries(document).length === 0 &&
          typeof document === 'object' &&
          document !== null
        )
      }
      const documents = {
        ataFile: false,
        laudaFile: false,
        presFile: false
      }
      documents.ataFile = !check(this.ataDocument)
      documents.laudaFile = !check(this.laudaDocument)
      documents.presFile = !check(this.presDocument)

      return documents
    }
  },
  created() {
    this.getStudentsDocument()
  },

  methods: {
    getStudentsDocument() {
      this.$axios
        .get(`/api/students/${this.studentData.id}/documents`)
        .then(res => {
          this.mapDocuments(res.data)
        })
        .catch(() => {
          this.$toast.open({
            message: 'Falha ao carregar os documentos do aluno',
            type: 'is-danger'
          })
        })
    },
    putStudents() {
      this.isLoading = true

      this.$axios
        .put(`/api/students/${this.studentData.id}`, this.studentData)
        .then(res => {
          this.isLoading = false
          this.studentData = res.data
          this.$toast.open({
            message: 'Aluno atualizado com sucesso.',
            type: 'is-success'
          })
          this.$emit('student-put')
        })
        .catch(error => {
          this.isLoading = false
          this.openErrorNotification(error.response.data.code)
        })
    },
    toggleEdit() {
      this.canEdit = !this.canEdit
    },
    mapDocuments(documents) {
      documents.forEach(element => {
        if (element.type === 1) {
          this.ataDocument = Object.assign({}, element)
          this.ataCheck = true
        } else if (element.type === 2) {
          this.laudaDocument = Object.assign({}, element)
          this.laudaCheck = true
        } else if (element.type === 3) {
          this.presDocument = Object.assign({}, element)
          this.presCheck = true
        }
      })
    },
    documentUpload(type) {
      this.isLoading = true
      const body = new FormData()
      body.append('file', this.uploadFile)
      body.append('documentType', type)
      this.$axios
        .post(`/api/students/${this.studentData.id}/documents`, body)
        .then(result => {
          this.isLoading = false
          if (type === '1') {
            Object.assign(this.ataDocument, result.data)
            this.ataCheck = true
          } else if (type === '2') {
            Object.assign(this.laudaDocument, result.data)
            this.laudaCheck = true
          } else if (type === '3') {
            Object.assign(this.presDocument, result.data)
            this.presCheck = true
          }
          this.$toast.open({
            message: 'Upload feito com sucesso',
            type: 'is-success'
          })
          this.getStudentsDocument()
        })
        .catch(error => {
          this.isLoading = false
          this.openErrorNotification(error.response.data.code)
        })
    },
    validateUpload(type) {
      if (this.uploadFile.name.split('.').pop() === 'pdf') {
        this.documentUpload(type)
      } else {
        this.$toast.open({
          message: 'Por favor selecione um arquivo PDF',
          type: 'is-danger'
        })
        this.file = File
      }
    }
  }
}
</script>

<style scoped>
.card-header {
  align-items: center;
}

.icon {
  margin-left: 1em;
}
</style>
