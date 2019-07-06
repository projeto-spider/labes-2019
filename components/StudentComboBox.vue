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
              :value="advisor ? advisor.fullName || advisor.username : '-'"
            />
            <BaseStudentDataRow title="Status" :value="displayStatus" />

            <template v-if="defense">
              <strong>
                {{ hasDefended ? 'Defendeu em' : 'Data da defesa' }}
              </strong>

              <br />

              <b-field>
                <DatePicker v-model="defense.date" :disabled="true" />
              </b-field>
            </template>
            <template v-if="canEditTerm">
              <strong>
                Período
              </strong>
              <br />
              <InputValidation
                ref="termIpt"
                valid-message="Ok"
                :invalid-message="['Mantenha no formato de xxxx.x']"
                :valid="validTerm"
              >
                <b-input
                  v-model="studentData.term"
                  :disabled="!canEdit"
                  @blur="onBlur('termIpt')"
                >
                </b-input>
              </InputValidation>
            </template>
            <strong>E-mail</strong>:
            <b-input v-model="studentData.email" :disabled="!canEdit"></b-input>
            <br />
            <strong>CRG</strong>:
            <b-input
              v-model="studentData.crg"
              :min="0"
              :max="10"
              :disabled="!canEdit || !canEditCrg"
              @blur="onCrgBlur"
            ></b-input>
            <br />
            <b-checkbox
              v-if="studentData.isConcluding || studentData.isGraduating"
              v-model="missingCollationCheck"
              label="Faltou à colação"
              :disabled="!canEdit"
            >
              Faltou à colação
            </b-checkbox>
            <br />
            <b-button
              v-if="student.isForming"
              class="is-primary"
              @click="getPendencies"
            >
              {{
                !canEdit
                  ? 'Verificar Disciplinas pendentes'
                  : 'Editar Disciplinas pendentes'
              }}:
              {{ totalPendencies }}
            </b-button>
            <b-modal :active.sync="showPendencies">
              <div class="card">
                <header class="card-header">
                  <b-icon pack="fas" icon="check" size="is-medium"></b-icon>
                  <p class="card-header-title">Disciplinas pendentes</p>
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
                      <b-button v-if="canEdit" @click="updatePendencies">
                        Confirmar
                      </b-button>
                      <b-button v-if="!canEdit" @click="showPendencies = false">
                        Fechar
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
                <b-button class="is-success" @click="confirmCrg">
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
import BaseStudentDataRow from '@/components/StudentComboBox/BaseStudentDataRow'
import DocumentRow from '@/components/StudentComboBox/DocumentRow'
import DatePicker from '@/components/DatePicker'
import { errorsHandler } from '@/components/mixins/errors'
import { studentStatus } from '@/components/mixins/studentStatus'
import InputValidation from '@/components/InputValidation'
const { documents } = process.env.enums
const { ATA, LAUDA, LISTA_PRESCRICAO } = documents

export default {
  name: 'StudentComboBox',
  components: {
    DocumentRow,
    DatePicker,
    BaseStudentDataRow,
    InputValidation
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
      missingCollationCheck: this.student.missingCollation,
      presCheck: false,
      cdCheck: this.student.cd,
      showPendencies: false,
      ataDocument: {},
      laudaDocument: {},
      presDocument: {},
      totalSubjects: [],
      studentSubjects: [],
      studentData: Object.assign({}, this.student),
      isLoading: false,
      totalPendencies: 0,
      defense: false,
      advisor: false
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

    canEditCrg() {
      return (
        Boolean(this.studentData.isGraduating) &&
        Boolean(this.studentData.isFit)
      )
    },
    canEditTerm() {
      return (
        this.studentData.isGraduating ||
        this.studentData.isForming ||
        this.studentData.isConcluding
      )
    },
    validTerm() {
      const re = new RegExp('[0-9]{4,4}\\.[1-4]')
      return re.test(this.studentData.term)
    }
  },

  created() {
    this.getStudentsDocument()
    this.$services.pendencies
      .fetchAll(this.student.id)
      .then(res => {
        this.studentSubjects = res.data.map(pendency => pendency.subjectId)
        this.totalPendencies = res.data.length
      })
      .catch(e => this.openErrorNotification(e))

    if (this.student.defenseId) {
      this.$services.defenses
        .fetch(this.student.defenseId)
        .then(({ data: defense }) => {
          this.defense = defense
          const { userId } = defense

          return this.$services.users.fetch(userId)
        })
        .then(({ data: advisor }) => {
          this.advisor = advisor
        })
    }
  },

  methods: {
    onBlur(refName) {
      this.$refs[refName].dirty = true
    },
    getStudentsDocument() {
      this.$services.documents
        .fetchAll(this.studentData.id)
        .then(res => this.mapDocuments(res.data))
        .catch(() => {
          this.$toast.open({
            message: 'Falha ao carregar os documentos do aluno',
            type: 'is-danger'
          })
        })
    },
    confirmCrg() {
      if (this.studentData.crg !== this.student.crg) {
        this.$dialog.confirm({
          message: `Você confirma o CRG: ${this.studentData.crg}`,
          onConfirm: () => {
            this.putStudents()
          }
        })
      } else {
        this.putStudents()
      }
    },
    putStudents() {
      this.isLoading = true
      const cd = this.cdCheck
      const { email } = this.studentData
      const missingCollation = this.missingCollationCheck
      const crg = this.canEditCrg ? this.studentData.crg : undefined
      const term = this.canEditTerm ? this.studentData.term : undefined
      const payload = { email, cd, crg, missingCollation, term }
      this.$services.students
        .update(this.studentData.id, payload)
        .then(res => {
          this.isLoading = false
          this.studentData = res.data
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
      if (!this.canEdit) {
        this.studentData = Object.assign({}, this.student)
      }
    },

    getPendencies() {
      this.$services.subjects
        .fetchAll()
        .then(res => {
          this.totalSubjects = res.data
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
      this.$services.pendencies
        .update(this.studentData.id, this.studentSubjects)
        .then(res => {
          this.$toast.open({
            message: 'Pendências de aluno atualizadas com sucesso',
            type: 'is-success'
          })
          this.totalPendencies = res.data.length
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
      this.$services.documents
        .create(this.studentData.id, { type, file })
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
      this.$services.documents
        .destroy(this.studentData.id, id)
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
