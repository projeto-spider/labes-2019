<template>
  <div>
    <div v-if="title" class="columns is-centered">
      <h1 class="title">
        <strong>{{ title }}</strong>
      </h1>
    </div>
    <br />
    <div class="columns is-centered">
      <div class="column is-10">
        <b-input
          v-model="searchStudentName"
          placeholder="Digite um nome"
          type="search"
          rounded
          expanded
        >
        </b-input>
        <br />
        <b-table
          :loading="loading"
          :striped="true"
          :hoverable="true"
          :data="defenses"
          :columns="columns"
          class="searchInputTable"
          focusable
          paginated
          backend-pagination
          :total="total"
          :per-page="perPage"
          backend-sorting
          @page-change="onPageChange"
          @select="selectDefense"
        />
        <b-modal :active.sync="modalOpen" has-modal-card>
          <div class="card widescreen">
            <div class="card-content">
              <div class="content">
                <div class="columns">
                  <div class="column is-7" :class="{ 'is-half': isAdmin }">
                    <header class="card-header">
                      <b-icon pack="fas" icon="info" size="is-small"></b-icon>
                      <p class="card-header-title">Informações da defesa</p>
                    </header>
                  </div>

                  <div v-if="isAdmin" class="column is-5">
                    <header class="card-header">
                      <b-icon pack="fas" icon="info" size="is-small"></b-icon>
                      <p class="card-header-title">Documentos Gerados</p>
                    </header>
                  </div>
                </div>
                <div class="columns scrollable-modal">
                  <div
                    class="hideLeftColumn column is-left is-7"
                    :class="{ 'defense-modal-teacher': !isAdmin }"
                  >
                    <DefenseForm
                      v-if="modalOpen"
                      ref="defenseForm"
                      v-model="selectedDefense"
                      :original="preEditDefense"
                      :on-submit="onSubmit"
                      :force-disable="!editDefense"
                    />
                  </div>

                  <div v-if="isAdmin" class="column is-right is-5">
                    <div class="list is-hoverable list-pdfs">
                      <a
                        v-for="pdf in availablePdfs"
                        :key="pdf.key"
                        class="list-item"
                        :href="
                          `/api/defenses/` +
                            preEditDefense.id +
                            `/pdf/${pdf.key}?token=` +
                            token
                        "
                        target="_blank"
                      >
                        <span>
                          <b-icon
                            pack="fas"
                            icon="file-pdf"
                            size="is-small"
                            style="position: relative; top: 5px"
                          />
                          {{ pdf.prefix }} {{ pdf.name }}
                        </span>
                      </a>
                    </div>

                    <br />

                    <div class="list is-hoverable list-pdfs">
                      <a
                        class="list-item"
                        :href="
                          '/api/defenses/' +
                            preEditDefense.id +
                            '/pdf?token=' +
                            token
                        "
                        target="_blank"
                      >
                        <span>
                          <b-icon
                            pack="fas"
                            icon="file-pdf"
                            size="is-small"
                            style="position: relative; top: 5px"
                          />
                          Ver Todos
                        </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card-buttons">
              <div class="buttons">
                <b-button
                  v-if="!readOnly"
                  class="button is-danger bg-transition"
                  :disabled="status === 'done'"
                  @click="onClickDeleteDefense"
                >
                  <b-icon icon="trash"></b-icon>
                </b-button>
                <b-button
                  v-if="status === 'pending' || !readOnly"
                  @click="toggleEditDefense"
                >
                  {{ editDefense ? 'Cancelar Edição' : 'Editar' }}
                </b-button>

                <b-button
                  v-if="status === 'pending' && !readOnly"
                  type="is-success"
                  @click="move(selectedDefense, 'accepted')"
                >
                  Confirmar
                </b-button>

                <template v-if="status === 'accepted' && !readOnly">
                  <b-button
                    class="button is-normal is-primary is-modal"
                    @click="toggleDisclosureModal"
                  >
                    Divulgação
                  </b-button>
                  <b-button
                    type="is-warning"
                    @click="move(selectedDefense, 'pending')"
                  >
                    Mover para Pendentes
                  </b-button>

                  <b-button
                    type="is-success"
                    :disabled="!selectedDefense.grade"
                    @click="move(selectedDefense, 'done')"
                  >
                    Finalizar
                  </b-button>
                </template>

                <b-button
                  v-if="status === 'done' && !readOnly"
                  type="is-warning"
                  @click="move(selectedDefense, 'accepted')"
                >
                  Mover para Aceitas
                </b-button>
              </div>
            </div>
          </div>
        </b-modal>

        <div class="modal" :class="{ 'is-active': isDisclosureModalActive }">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Modelo de divulgação</p>
              <button
                class="delete"
                aria-label="close"
                @click.stop.prevent="toggleDisclosureModal"
              ></button>
            </header>
            <section class="modal-card-body">
              <textarea
                v-model="disclosure"
                class="textarea"
                rows="15"
              ></textarea>
            </section>
            <footer class="modal-card-foot">
              <button class="button is-primary" @click="doCopy">
                Copiar
              </button>
              <button
                class="button"
                @click.stop.prevent="toggleDisclosureModal"
              >
                Cancelar
              </button>
            </footer>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import pDebounce from 'p-debounce'
import { errorsHandler } from '@/components/mixins/errors'
import DefenseForm from '@/components/DefenseForm'

const requiredDocuments = [
  { prefix: 'Ata', key: 'ata' },
  { prefix: 'Capa do CD', key: 'cd' },
  { prefix: 'PDF de Divulgação', key: 'divulgacao' }
]

export default {
  prefix: 'TccDefenseSearch',

  components: {
    DefenseForm
  },
  mixins: [errorsHandler],

  props: {
    publish: {
      type: Boolean,
      default: false
    },

    title: {
      type: String,
      default: () => ''
    },

    status: {
      type: String,
      required: false,
      default: undefined
    },
    readOnly: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      loading: false,
      total: 0,
      totalPages: 0,
      page: 1,
      perPage: 10,
      defenses: [],
      modalOpen: false,
      selectedDefense: false,
      preEditDefense: false,
      editDefense: false,
      searchStudentName: '',
      isDisclosureModalActive: false,
      columns: [
        {
          field: 'advisorName',
          label: 'Orientador'
        },
        {
          field: 'registrationNumbers',
          label: 'Matrículas'
        },
        {
          field: 'students',
          label: 'Nomes'
        },
        {
          field: 'date',
          label: 'Data'
        },
        {
          field: 'time',
          label: 'Hora'
        },
        {
          field: 'local',
          label: 'Local'
        }
      ],
      hideLeftColumn: {
        column: true,
        'is-left': this.isAdmin,
        'is-half': this.isAdmin
      }
    }
  },

  computed: {
    ...mapState({
      courseTag: state => state.courseTag,
      token: state => state.auth.token
    }),

    ...mapGetters({ currentUser: 'auth/currentUser' }),

    disclosure() {
      return disclosureModel(this.preEditDefense)
    },

    availablePdfs() {
      if (!this.preEditDefense) {
        return []
      }

      const studentNames = this.preEditDefense.students
        .split(',')
        .map(string => string.trim())

      const certificates = [
        {
          prefix: 'Certificado do Orientador',
          key: 'certificado1',
          name: this.preEditDefense.advisorName
        },
        {
          prefix: 'Certificado do Co-Orientador',
          key: 'certificado2',
          name: this.preEditDefense.coAdvisorName
        },
        {
          prefix: 'Certificado do Avaliador',
          key: 'certificado3',
          name: this.preEditDefense.evaluator1Name
        },
        {
          prefix: 'Certificado do Avaliador',
          key: 'certificado4',
          name: this.preEditDefense.evaluator2Name
        },
        {
          prefix: 'Certificado do Avaliador',
          key: 'certificado5',
          name: this.preEditDefense.evaluator3Name
        },
        {
          prefix: 'Certificado do Aluno',
          key: 'certificado6',
          name: studentNames[0]
        },
        {
          prefix: 'Certificado do Aluno',
          key: 'certificado7',
          name: studentNames[1]
        }
      ].filter(validPerson)

      const credentials = [
        {
          prefix: 'Credenciamento de Membro Externo',
          key: 'credenciamento1',
          name: this.preEditDefense.advisorName,
          type: this.preEditDefense.advisorType
        },
        {
          prefix: 'Credenciamento de Membro Externo',
          key: 'credenciamento2',
          name: this.preEditDefense.coAdvisorName,
          type: this.preEditDefense.coAdvisorType
        },
        {
          prefix: 'Credenciamento de Membro Externo',
          key: 'credenciamento3',
          name: this.preEditDefense.evaluator1Name,
          type: this.preEditDefense.evaluator1Type
        },
        {
          prefix: 'Credenciamento de Membro Externo',
          key: 'credenciamento4',
          name: this.preEditDefense.evaluator2Name,
          type: this.preEditDefense.evaluator2Type
        },
        {
          prefix: 'Credenciamento de Membro Externo',
          key: 'credenciamento5',
          name: this.preEditDefense.evaluator3Name,
          type: this.preEditDefense.evaluator3Type
        }
      ].filter(validExternalEvaluator)

      return requiredDocuments.concat(certificates).concat(credentials)
    },
    isAdmin() {
      return this.currentUser.role === 'admin'
    }
  },

  watch: {
    searchStudentName: pDebounce(function triggerSearch() {
      this.loadDefenses()
    }, 500),
    courseTag() {
      this.loadDefenses()
    }
  },

  created() {
    this.loadDefenses()
  },

  methods: {
    toggleEditDefense() {
      this.editDefense = !this.editDefense
      if (this.editDefense === false) {
        this.selectedDefense = Object.assign({}, this.preEditDefense)
        if (this.$refs.defenseForm) {
          this.$refs.defenseForm.updateModel()
        }
      }
    },
    selectDefense(row) {
      this.preEditDefense = Object.assign({}, row)
      this.editDefense = false
      this.modalOpen = true
      this.selectedDefense = row
    },
    onClickDeleteDefense() {
      this.loading = true
      this.$dialog.confirm({
        title: 'Excluir Defesa de TCC',
        message:
          'Você tem certeza que quer <b>Excluir</b> a defesa de TCC? Essa ação não pode ser desfeita.',
        confirmText: 'Excluir',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          this.deleteDefense()
          this.loading = false
        },
        onCancel: () => {
          this.$toast.open({
            message: 'Exclusão de Defesa de TCC cancelada.',
            type: 'is-warning'
          })
          this.loading = false
        }
      })
    },
    deleteDefense() {
      this.$services.defenses
        .destroy(this.selectedDefense.id)
        .then(res => {
          this.$toast.open({
            message: 'Defesa excluída com sucesso!',
            key: 'is-success'
          })
          this.loading = false
          this.loadDefenses()
          this.modalOpen = false
        })
        .catch(() => {
          this.$toast.open({
            message: 'Falha ao excluir defesa.',
            key: 'is-danger'
          })
          this.loading = false
        })
    },
    unselectDefense() {
      this.editDefense = false
      this.modalOpen = false
      this.selectedDefense = false
    },

    loadDefenses() {
      this.loading = true
      const { courseTag, status, page = 1, searchStudentName } = this

      const query = searchStudentName ? `%${searchStudentName}%` : undefined

      const params = { page, course: courseTag, status, query }

      return this.$services.defenses
        .fetchPage(params)
        .then(res => {
          this.defenses = res.data
          this.total = +res.headers['pagination-row-count']
          this.perPage = +res.headers['pagination-page-size']
          this.loading = false
        })
        .catch(() => {
          this.$toast.open({
            message: 'Falha ao carregar a lista de defesas.',
            key: 'is-danger'
          })
          this.loading = false
        })
    },

    onPageChange(page) {
      this.page = page
      this.loadDefenses()
    },

    onSubmit(payload) {
      return this.put(payload).then(res => {
        this.$toast.open({
          message: 'Solicitação atualizada com sucesso!',
          key: 'is-success'
        })

        const original = this.defenses.find(
          defense => defense.id === res.data.id
        )

        if (original) {
          Object.assign(original, res.data)
          Object.assign(this.selectedDefense, res.data)
        }

        this.preEditDefense = { ...res.data }
      })
    },

    move(defense, status) {
      return this.put(defense, { status }).then(updated => {
        this.$toast.open({
          message: 'Solicitação movida com sucesso!',
          key: 'is-success'
        })

        this.unselectDefense()
        this.$emit('move')
      })
    },

    put(defense, payload) {
      if (!payload) {
        payload = defense
      }
      return this.$services.defenses
        .update(defense.id, payload)
        .catch(error => {
          this.openErrorNotification(error.response.data.code)
          throw error
        })
    },

    toggleDisclosureModal() {
      this.isDisclosureModalActive = !this.isDisclosureModalActive
    },

    doCopy() {
      try {
        const el = document.createElement('textarea')
        el.value = this.disclosure
        el.setAttribute('readonly', '')
        el.style = { position: 'absolute', left: '-9999px' }
        document.body.appendChild(el)
        el.select()
        document.execCommand('copy')
        document.body.removeChild(el)
        this.$toast.open({ message: 'Copiado!', type: 'is-success' })
      } catch (e) {
        this.$toast.open({ message: 'Erro ao copiar!', type: 'is-danger' })
      }
    }
  }
}

function disclosureModel(selectedDefense) {
  return `DEFESA PÚBLICA DO TRABALHO DE
CONCLUSÃO DO CURSO DE ${
    selectedDefense.course === 'cbcc'
      ? 'CIÊNCIA DA COMPUTAÇÃO'
      : 'SISTEMAS DE INFORMAÇÃO'
  }

Discente(s): ${selectedDefense.students}

Título: ${selectedDefense.title}

Banca:

${formalTitle(selectedDefense.advisorTitle, selectedDefense.advisorIsTeacher)}${
    selectedDefense.advisorName
  } (ORIENTADOR(A))
${
  selectedDefense.coAdvisorName !== ''
    ? formalTitle(
        selectedDefense.coAdvisorTitle,
        selectedDefense.coAdvisorIsTeacher
      ) + `${selectedDefense.coAdvisorName} (COORIENTADOR(A))`
    : ''
}
${formalTitle(
  selectedDefense.evaluator1Title,
  selectedDefense.evaluator1IsTeacher
)}${selectedDefense.evaluator1Name} (AVALIADOR(A))
${formalTitle(
  selectedDefense.evaluator2Title,
  selectedDefense.evaluator2IsTeacher
)}${selectedDefense.evaluator2Name} (AVALIADOR(A))
${
  selectedDefense.evaluator3Name !== ''
    ? formalTitle(
        selectedDefense.evaluator3Title,
        selectedDefense.evaluator3IsTeacher
      ) + `${selectedDefense.evaluator3Name} (AVALIADOR(A))`
    : ''
}

Data e local: ${dateInFull(selectedDefense.date)} às ${hourFormatted(
    selectedDefense.time
  )} - ${selectedDefense.local}

RESUMO

${selectedDefense.summary}`
}

function formalTitle(title, isTeacher = false) {
  const prefix = isTeacher ? 'Prof(a). ' : ''

  if (title === 'doctor') {
    return prefix + 'Doutor(a) '
  }

  if (title === 'master') {
    return prefix + 'Mestre(a) '
  }

  return prefix
}

function validPerson({ name }) {
  return !!name
}

function validExternalEvaluator(evaluator) {
  return validPerson(evaluator) && evaluator.type === 'external'
}

function dateInFull(defenseDate) {
  const month = [
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
  ]
  if (typeof defenseDate !== 'string') {
    return ''
  }

  const date = defenseDate.split('/')
  return date.length === 3
    ? `${date[0]} de ${month[date[1] - 1]} de ${date[2]}`
    : ''
}

function hourFormatted(defenseHour) {
  if (typeof defenseHour !== 'string') {
    return ''
  }
  // '00:00:00'
  const hour = defenseHour
    // ['00', '00', '00']
    .split(':')
    // '00h00h00'
    .join('h')
    // '00h00'
    .slice(0, 5)
    // '00h00min'
    .concat('min')

  return hour
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

.scrollable-modal {
  overflow-y: hidden;
  height: 500px;
}

.card-buttons {
  position: absolute;
  right: 0;
  bottom: -40px;
}

.list-pdfs {
  max-width: 90%;
  margin: 0 auto;
}

.defense-modal-teacher {
  margin: 0 auto;
  width: 85%;
}
</style>
