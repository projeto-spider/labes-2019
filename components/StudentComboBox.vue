<template>
  <div class="card widescreen">
    <header class="card-header">
      <b-icon pack="fas" icon="user" size="is-medium"></b-icon>
      <p class="card-header-title">{{ studentData.name }}</p>
    </header>
    <div class="card-content">
      <div class="content">
        <div class="columns">
          <div class="column is-half" style="overflow-y: unset">
            <BaseStudentDataRow title="Nome" :value="studentData.name" />
            <BaseStudentDataRow
              title="Matrícula"
              :value="studentData.registrationNumber"
            />
            <BaseStudentDataRow
              title="Orientador"
              :value="studentData.advisor || '-'"
            />
            <BaseStudentDataRow title="Status" :value="displayStatus" />

            <strong>{{ hasDefended ? 'Defendeu em' : 'Data da defesa' }}</strong
            ><br />
            <b-field>
              <DatePicker
                v-model="studentData.defenseDate"
                :max-date="hasDefended ? new Date() : undefined"
                :disabled="!canEdit"
              />
            </b-field>
            <strong>E-mail</strong>:
            <b-input v-model="studentData.email" :disabled="!canEdit"></b-input>
            <br />
            <strong>CRG</strong>:
            <b-input
              v-model="studentData.crg"
              type="number"
              :min="0"
              :max="10"
              :disabled="!canEdit || !canEditCrg"
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
              <p class="title is-4">Documentos</p>
              <div class="table-container">
                <table class="table is-narrow table-documents">
                  <tbody>
                    <DocumentRow
                      v-model="ataDocument"
                      title="Ata"
                      :check.sync="ataCheck"
                      :disable="!canEdit"
                      @update:file="
                        file => onUpdateFile($options.documents.ATA, file)
                      "
                      @update:check="value => (ataCheck = value)"
                      @delete="onDeleteDocument"
                    />

                    <DocumentRow
                      v-model="laudaDocument"
                      title="Lauda"
                      :check.sync="laudaCheck"
                      :disable="!canEdit"
                      @update:file="
                        file => onUpdateFile($options.documents.LAUDA, file)
                      "
                      @update:check="value => (laudaCheck = value)"
                      @delete="onDeleteDocument"
                    />

                    <tr>
                      <td>
                        <strong>CD</strong>
                      </td>
                      <td>
                        <b-checkbox
                          v-model="cdCheck"
                          :disabled="!canEdit"
                        ></b-checkbox>
                      </td>
                      <td colspan="2"></td>
                    </tr>

                    <DocumentRow
                      v-model="presDocument"
                      title="Lista presc."
                      :check.sync="presCheck"
                      :disable="!canEdit"
                      hide-when-cant-edit
                      @update:file="
                        file =>
                          onUpdateFile(
                            $options.documents.LISTA_PRESCRICAO,
                            file
                          )
                      "
                      @update:check="value => (presCheck = value)"
                      @delete="onDeleteDocument"
                    />
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
              <b-button
                class="bg-transition"
                :type="canEdit ? 'is-danger' : 'is-primary'"
                :outlined="canEdit"
                @click="toggleEdit"
              >
                {{ canEdit ? 'Parar Edição' : 'Editar' }}
              </b-button>
            </b-field>
          </div>
        </div>
        <transition name="slide-fade-horizontal">
          <div v-show="canEdit" class="level-right">
            <div class="level-item">
              <b-field>
                <b-button class="is-success" @click="putStudents">
                  Atualizar
                </b-button>
              </b-field>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
// BEGIN REFACTOR
import BaseStudentDataRow from '@/components/StudentComboBox/BaseStudentDataRow'
import DocumentRow from '@/components/StudentComboBox/DocumentRow'
import DatePicker from '@/components/DatePicker'
import { errorsHandler } from '@/components/mixins/errors'
import { studentStatus } from '@/components/mixins/studentStatus'

const { documents } = process.env.enums
const { ATA, LAUDA, LISTA_PRESCRICAO } = documents

export default {
  name: 'StudentComboBox',
  components: {
    DocumentRow,
    DatePicker,
    BaseStudentDataRow
  },
  mixins: [errorsHandler, studentStatus],
  documents,
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
      totalSubjects: [],
      studentSubjects: [],
      studentData: Object.assign({}, this.student),
      isLoading: false
    }
  },
  computed: {
    displayStatus() {
      return this.getStatus(this.studentData)
    },

    hasDefended() {
      const isGraduating = Boolean(this.studentData.isGraduating)
      const isForming = Boolean(this.studentData.isForming)

      return isGraduating || isForming
    },

    cdCheck: {
      get() {
        return Boolean(this.studentData.cd)
      },
      set(newValue) {
        this.studentData.cd = newValue ? '1' : '0'
      }
    },

    canEditCrg() {
      return (
        Boolean(this.studentData.isGraduating) &&
        Boolean(this.studentData.isFit)
      )
    }
  },

  created() {
    this.getStudentsDocument()

    const endpoint = `/api/students/${this.student.id}/pendencies`
    this.$axios
      .get(endpoint)
      .then(response => {
        this.studentSubjects = response.data.map(pendency => pendency.subjectId)
      })
      .catch(e => this.openErrorNotification(e))
  },

  methods: {
    getStudentsDocument() {
      const endpoint = `/api/students/${this.studentData.id}/documents`
      this.$axios
        .$get(endpoint)
        .then(this.mapDocuments)
        .catch(() => {
          this.$toast.open({
            message: 'Falha ao carregar os documentos do aluno',
            type: 'is-danger'
          })
        })
    },

    putStudents() {
      this.isLoading = true

      const endpoint = `/api/students/${this.studentData.id}`
      const { defenseDate, email, cd } = this.studentData
      const crg = this.canEditCrg ? this.studentData.crg : undefined
      const payload = { defenseDate, email, cd, crg }
      this.$axios
        .$put(endpoint, payload)
        .then(data => {
          this.isLoading = false
          this.studentData = data
          this.canEdit = false
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
        .$get(`/api/subjects`, {
          params: {
            paginate: 0
          }
        })
        .then(data => {
          this.totalSubjects = data
          this.showPendencies = true
        })
        .catch(e => {
          this.showPendencies = false
          this.openErrorNotification(e)
        })
    },

    updatePendencies() {
      if (!this.canEdit) {
        return
      }

      const endpoint = `/api/students/${this.student.id}/pendencies/batch`
      this.$axios
        .post(endpoint, this.studentSubjects)
        .then(() => {
          this.$toast.open({
            message: 'Pendências de aluno atualizadas com sucesso',
            type: 'is-success'
          })
        })
        .catch(e => this.openErrorNotification(e))

      this.showPendencies = false
    },

    mapDocuments(documents) {
      this.ataDocument = {}
      this.laudaDocument = {}
      this.presDocument = {}

      for (const document of documents) {
        switch (document.type) {
          case ATA:
            this.ataDocument = Object.assign({}, document)
            this.ataCheck = true
            break

          case LAUDA:
            this.laudaDocument = Object.assign({}, document)
            this.laudaCheck = true
            break

          case LISTA_PRESCRICAO:
            this.presDocument = Object.assign({}, document)
            this.presCheck = true
            break

          default:
            // TODO: Caso de erro?
            break
        }
      }
    },

    onUpdateFile(type, file) {
      this.isLoading = true

      const body = new FormData()
      body.append('file', file)
      body.append('documentType', type)
      const endpoint = `/api/students/${this.studentData.id}/documents`
      this.$axios
        .post(endpoint, body)
        .then(() => {
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
    onDeleteDocument(document) {
      this.isLoading = true

      const { id } = document
      const endpoint = `/api/students/${this.studentData.id}/documents/${id}`
      this.$axios
        .delete(endpoint)
        .then(() => {
          this.isLoading = false
          this.$toast.open({
            message: 'Exclusão feita com sucesso',
            type: 'is-success'
          })
          this.getStudentsDocument()
        })
        .catch(error => {
          this.isLoading = false
          this.openErrorNotification(error.response.data.code)
        })
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
    }
  }
}
</script>

<style scoped>
.widescreen {
  width: 100vw;
}

.scrollable {
  overflow-y: scroll;
}

.bottom-sticky {
  bottom: 0;
  position: sticky;
}

.bg-transition {
  transition: background-color ease 0.1s;
}
</style>

<style>
.card-header {
  align-items: center;
}

.icon {
  margin-left: 1em;
}
</style>
