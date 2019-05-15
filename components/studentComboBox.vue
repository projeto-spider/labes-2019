<template>
  <div class="card">
    <header class="card-header">
      <b-icon pack="fas" icon="user" class="icon"></b-icon>
      <span class="card-header-title">{{ student.name }}</span>
    </header>
    <div class="card-content">
      <div class="content">
        <div class="columns">
          <div class="column is-half">
            <strong>Nome</strong>: {{ student.name }} <br />
            <strong>Matrícula</strong>: {{ student.registrationNumber }} <br />
            <strong>E-mail</strong>: {{ student.email }} <br />
            <strong>Status</strong>: {{ displayStatus }} <br />
            <strong>CRG</strong>: <b-input :disabled="!canEdit"></b-input>
            <br />
            <strong>Pendências</strong>:
            <b-input :disabled="!canEdit"></b-input> <br />
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
                          v-if="checkDocumentIsNotEmpty(ataDocument)"
                          :href="documents"
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
                          :disabled="!ataCheck"
                          @input="validateUpload(1)"
                        >
                          <a class="button is-primary" :disabled="!ataCheck">
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
                          v-if="checkDocumentIsNotEmpty(laudaDocument)"
                          :href="documents"
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
                          :disabled="!laudaCheck"
                          @input="validateUpload(2)"
                        >
                          <a class="button is-primary" :disabled="!laudaCheck">
                            <b-icon icon="upload"></b-icon>
                          </a>
                        </b-upload>
                      </td>
                    </tr>
                    <tr>
                      <td><strong>CD</strong></td>
                      <td>
                        <b-checkbox :disabled="!canEdit"></b-checkbox>
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
                          v-if="checkDocumentIsNotEmpty(presDocument)"
                          :href="presDocument.url"
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
                          :disabled="!presCheck"
                          @input="validateUpload(3)"
                        >
                          <a class="button is-primary" :disabled="!presCheck">
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
              <b-button class="is-primary"> Submeter</b-button>
            </b-field>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
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
      documents: [
        {
          id: 1,
          studentID: 10,
          type: 2,
          URL: 'url do documento'
        },
        {
          id: 1,
          studentID: 10,
          type: 3,
          URL: 'url do documento'
        }
      ],
      ataDocument: {},
      laudaDocument: {},
      presDocument: {},
      uploadFile: File
    }
  },
  computed: {
    displayStatus() {
      return '"Sei não, hein?"'
    }
  },
  created() {
    this.getStudentsDocument()
  },

  methods: {
    getStudentsDocument() {
      this.$axios
        .get(`/api/students/${this.student.id}/documents`)
        .then(res => {
          this.documents = res.data
          this.mapDocuments()
        })
        .catch(() => {
          this.$toast.open({
            message: 'Falha ao carregar os documentos do aluno',
            type: 'is-danger'
          })
        })
    },
    putStudents() {
      // TODO PUT
    },
    toggleEdit() {
      this.canEdit = !this.canEdit
    },
    mapDocuments() {
      this.documents.forEach(element => {
        if (element.type === '1') {
          Object.assign(this.ataDocument, element)
          this.ataCheck = true
        } else if (element.type === '2') {
          Object.assign(this.laudaDocument, element)
          this.laudaCheck = true
        } else if (element.type === '3') {
          Object.assign(this.presDocument, element)
          this.presCheck = true
        }
      })
    },
    checkDocumentIsNotEmpty(document) {
      return (
        !Object.entries(document).length === 0 &&
        document.constructor === Object
      )
    },
    documentUpload(type) {
      // TODO ENDPOINT
      this.isLoading = true
      const body = new FormData()
      body.append('document', this.uploadFile)
      body.append('type', type)
      this.$axios
        .post(`/api/students/${this.student.id}/document`, body)
        .then(result => {
          this.isLoading = false
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
      // eslint-disable-next-line no-console
      console.log(this.uploadFile)
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
