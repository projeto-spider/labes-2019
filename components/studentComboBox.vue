<template>
  <div class="card widescreen">
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
            <strong>Orientador</strong>: {{ studentData.advisor }} <br />

            <strong>{{ defenseDateStatus }}</strong
            ><br />

            <b-field>
              <b-datepicker
                v-model="defenseDate"
                :date-formatter="dateFormatter"
                :disabled="!canEdit"
                :month-names="[
                  'Janeiro',
                  'Fevereiro',
                  'Março',
                  'Abril',
                  'Maio',
                  'Junho',
                  'Julho',
                  'Agosto',
                  'Setembro',
                  'Outubro',
                  'Novembro',
                  'Dezembro'
                ]"
                :day-names="['D', 'S', 'T', 'Q', 'Q', 'S', 'S']"
                first-day-of-week="0"
              ></b-datepicker>
            </b-field>

            <strong>E-mail</strong>:
            <b-input v-model="studentData.email" :disabled="!canEdit"></b-input>
            <br />
            <strong>Status</strong>: {{ displayStatus }} <br />
            <strong>CRG</strong>:
            <b-input
              v-model="studentData.crg"
              type="number"
              :min="0"
              :max="10"
              :disabled="!canEdit"
              @blur="onCrgBlur"
            ></b-input>
            <br />
            <b-button class="is-primary" @click="getPendencies">
              {{ !canEdit ? 'Verificar Pendências' : 'Editar Pendências' }}
            </b-button>
            <b-modal :active.sync="showPendencies">
              <div class="card">
                <header class="card-header">
                  <b-icon pack="fas" icon="check" size="is-medium"></b-icon>
                  <p class="card-header-title">Pendências</p>
                </header>
                <div class="card-content">
                  <div class="content">
                    <table class="table is-narrow scrollable">
                      <tbody>
                        <tr
                          v-for="subject of totalSubjects"
                          :key="subject.id"
                          class="field"
                        >
                          <td>{{ subject.name }}</td>
                          <td>
                            <b-checkbox
                              v-model="studentSubjects"
                              :native-value="subject.id"
                              :disabled="!canEdit"
                            ></b-checkbox>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                    <div class="modal-card-foot bottom-sticky">
                      <b-button @click="updatePendencies">
                        Confirmar
                      </b-button>
                    </div>
                  </div>
                </div>
              </div>
            </b-modal>
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
                          v-if="hasDocument.ataFile"
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
                          v-if="hasDocument.laudaFile"
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
                          v-model="cdCheck"
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
                    <tr v-if="canEdit || hasDocument.presFile">
                      <td><strong>Lista presc.</strong></td>
                      <td>
                        <b-checkbox
                          v-model="presCheck"
                          :disabled="!canEdit"
                        ></b-checkbox>
                      </td>
                      <td>
                        <a
                          v-if="hasDocument.presFile"
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
                Atualizar</b-button
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
import { studentStatus } from './mixins/studentStatus'
export default {
  name: 'StudentComboBox',
  mixins: [errorsHandler, studentStatus],
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
      showPendencies: false,
      ataDocument: {},
      laudaDocument: {},
      presDocument: {},
      uploadFile: File,
      crg: '',
      totalSubjects: [],
      studentSubjects: [],
      studentData: Object.assign({}, this.student),
      isLoading: false,
      defenseDate: new Date()
    }
  },
  computed: {
    ...mapState({
      token: state => state.auth.token
    }),
    displayStatus() {
      return this.getStatus(this.studentData)
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
    hasDocument() {
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
    },
    defenseDateStatus() {
      if (
        this.studentData.isGraduating === 1 ||
        this.studentData.isForming === 1
      ) {
        return 'Defendeu em'
      }
      return 'Data de Defesa'
    },
    cdCheck: {
      get() {
        return this.studentData.cd === 1
      },
      set(newValue) {
        this.studentData.cd = newValue ? '1' : '0'
      }
    }
  },

  created() {
    this.getStudentsDocument()
    this.defenseDate = this.studentData.defenseDate
      ? new Date(
          Date.parse(
            this.studentData.defenseDate
              .split('/')
              .reverse()
              .join('/')
          )
        )
      : null
    this.$axios
      .get(`/api/students/${this.student.id}/pendencies`)
      .then(response => {
        this.studentSubjects = response.data.map(
          pendency => pendency.subjectId
        )
      })
      .catch(e => this.openErrorNotification(e))
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
      const defenseDate =
        this.defenseDate &&
        this.defenseDate
          .toISOString()
          .slice(0, 10)
          .split('-')
          .reverse()
          .join('/')
      const payload = { ...this.studentData, defenseDate }
      this.$axios
        .put(`/api/students/${this.studentData.id}`, payload)
        .then(res => {
          this.isLoading = false
          this.studentData = res.data
          this.defenseDate = this.studentData.defenseDate
            ? new Date(
                Date.parse(
                  this.studentData.defenseDate
                    .split('/')
                    .reverse()
                    .join('/')
                )
              )
            : null
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
    getPendencies() {
      this.$axios
        .get(`/api/subjects`, {
          params: {
            paginate: 0
          }
        })
        .then(response => {
          this.totalSubjectsLength = response.headers['pagination-row-count']
          this.totalSubjects = response.data
          this.showPendencies = true
        })
        .catch(e => {
          this.showPendencies = false
          this.openErrorNotification(e)
        })
    },
    updatePendencies() {
      if (this.canEdit) {
        this.$axios
          .post(
            `/api/students/${this.student.id}/pendencies/batch`,
            this.studentSubjects
          )
          .then(response => {
            this.$toast.open({
              message: 'Pendências de aluno atualizadas com sucesso',
              type: 'is-success'
            })
          })
          .catch(e => this.openErrorNotification(e))
      }
      this.showPendencies = false
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
      const { config } = process.env
      if (!this.uploadFile) {
        return
      }
      if (this.uploadFile.size >= config.MAX_FILE_SIZE) {
        this.openErrorNotification(process.env.errors.MAX_FILE_SIZE_EXCEEDED)
        this.uploadFile = new File([''], 'Nenhum arquivo selecionado')
        this.hasErrors = true
        return
      }
      const isPDF = this.uploadFile.name.split('.').pop() === 'pdf'
      if (isPDF) {
        return this.documentUpload(type)
      }
      this.$toast.open({
        message: 'Por favor selecione um arquivo PDF',
        type: 'is-danger'
      })
      this.file = File
    },

    onCrgBlur(e) {
      let value = +e.target.value

      if (typeof value !== 'number') {
        return
      }

      if (value !== Math.floor(value)) {
        value = Math.trunc(+value * 1000) / 1000
      }

      this.studentData.crg = Math.max(0, Math.min(10, value))
    },
    dateFormatter(date) {
      return date
        .toISOString()
        .slice(0, 10)
        .split('-')
        .reverse()
        .join('/')
    }
  }
}
</script>

<style scoped>
.widescreen {
  width: 100vw;
}

.card-header {
  align-items: center;
}

.icon {
  margin-left: 1em;
}

.scrollable {
  overflow-y: scroll;
}

.bottom-sticky {
  bottom: 0;
  position: sticky;
}
</style>
