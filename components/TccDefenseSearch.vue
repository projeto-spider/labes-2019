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
                  <div class="column is-half">
                    <header class="card-header">
                      <b-icon pack="fas" icon="info" size="is-small"></b-icon>
                      <p class="card-header-title">Informações da defesa</p>
                    </header>
                  </div>

                  <div class="column is-half">
                    <header class="card-header">
                      <b-icon pack="fas" icon="info" size="is-small"></b-icon>
                      <p class="card-header-title">Documentos Gerados</p>
                    </header>
                  </div>
                </div>
                <div class="columns scrollable-modal">
                  <div class="column is-left is-half">
                    <DefenseForm
                      v-if="modalOpen"
                      v-model="selectedDefense"
                      :on-submit="onSubmit"
                      :force-disable="!editDefense"
                    />
                  </div>

                  <div class="column is-right is-half">
                    <div class="list is-hoverable list-pdfs">
                      <a
                        v-for="pdf in availablePdfs"
                        :key="pdf.key"
                        class="list-item"
                        :href="
                          `/api/defenses/` +
                            selectedDefense.id +
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
                            selectedDefense.id +
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

            <div v-if="!readOnly" class="card-buttons">
              <div class="buttons">
                <b-button @click.prevent="editDefense = !editDefense">
                  {{ editDefense ? 'Cancelar Edição' : 'Editar' }}
                </b-button>

                <b-button
                  v-if="status === 'pending'"
                  type="is-success"
                  @click="move(selectedDefense, 'accepted')"
                >
                  Confirmar
                </b-button>

                <template v-if="status === 'accepted'">
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
                    @click="move(selectedDefense, 'done')"
                  >
                    Finalizar
                  </b-button>
                </template>

                <b-button
                  v-if="status === 'done'"
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
import { mapState } from 'vuex'
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
      ]
    }
  },

  computed: {
    ...mapState({
      courseTag: state => state.courseTag,
      token: state => state.auth.token
    }),

    disclosure() {
      return disclosureModel(this.selectedDefense)
    },

    availablePdfs() {
      if (!this.selectedDefense) {
        return []
      }

      const studentNames = this.selectedDefense.students
        .split(',')
        .map(string => string.trim())

      const certificates = [
        {
          prefix: 'Certificado do Orientador',
          key: 'certificado1',
          name: this.selectedDefense.advisorName
        },
        {
          prefix: 'Certificado do Co-Orientador',
          key: 'certificado2',
          name: this.selectedDefense.coAdvisorName
        },
        {
          prefix: 'Certificado do Avaliador',
          key: 'certificado3',
          name: this.selectedDefense.evaluator1Name
        },
        {
          prefix: 'Certificado do Avaliador',
          key: 'certificado4',
          name: this.selectedDefense.evaluator2Name
        },
        {
          prefix: 'Certificado do Avaliador',
          key: 'certificado5',
          name: this.selectedDefense.evaluator3Name
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
          name: this.selectedDefense.advisorName,
          type: this.selectedDefense.advisorType
        },
        {
          prefix: 'Credenciamento de Membro Externo',
          key: 'credenciamento2',
          name: this.selectedDefense.coAdvisorName,
          type: this.selectedDefense.coAdvisorType
        },
        {
          prefix: 'Credenciamento de Membro Externo',
          key: 'credenciamento3',
          name: this.selectedDefense.evaluator1Name,
          type: this.selectedDefense.evaluator1Type
        },
        {
          prefix: 'Credenciamento de Membro Externo',
          key: 'credenciamento4',
          name: this.selectedDefense.evaluator2Name,
          type: this.selectedDefense.evaluator2Type
        },
        {
          prefix: 'Credenciamento de Membro Externo',
          key: 'credenciamento5',
          name: this.selectedDefense.evaluator3Name,
          type: this.selectedDefense.evaluator3Type
        }
      ].filter(validExternalEvaluator)

      return requiredDocuments.concat(certificates).concat(credentials)
    }
  },

  watch: {
    searchStudentName: pDebounce(function triggerSearch() {
      this.loadDefenses()
    }, 500)
  },

  created() {
    this.loadDefenses()
  },

  methods: {
    selectDefense(row) {
      this.editDefense = false
      this.modalOpen = true
      this.selectedDefense = row
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
      return this.put(payload).then(updated => {
        this.$toast.open({
          message: 'Solicitação atualizada com sucesso!',
          key: 'is-success'
        })

        const original = this.defenses.find(
          defense => defense.id === updated.id
        )

        if (original) {
          Object.assign(original, updated)
        }
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

${formalTitle(selectedDefense.advisorTitle)}${
    selectedDefense.advisorName
  } (ORIENTADOR(A))
${formalTitle(selectedDefense.coAdvisorTitle)}${
    selectedDefense.coAdvisorName !== ''
      ? `${selectedDefense.coAdvisorName} (COORIENTADOR(A))`
      : ''
  }
${formalTitle(selectedDefense.evaluator1Title)}${
    selectedDefense.evaluator1Name
  } (AVALIADOR(A))
${formalTitle(selectedDefense.evaluator2Title)}${
    selectedDefense.evaluator2Name
  } (AVALIADOR(A))
${formalTitle(selectedDefense.evaluator2Title)}${
    selectedDefense.evaluator3Name !== ''
      ? `${selectedDefense.evaluator3Name} (AVALIADOR(A))`
      : ''
  }

Data e local: ${dateInFull(selectedDefense.date)} às ${hourFormatted(
    selectedDefense.time
  )} - ${selectedDefense.local}

RESUMO

${selectedDefense.summary}`
}

function formalTitle(title) {
  if (title === 'doctor') {
    return 'Doutor(a) '
  }

  if (title === 'master') {
    return 'Mestre(a) '
  }

  return ''
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
  if (typeof defenseDate === 'string') {
    const date = defenseDate.split('/')
    return `${date[0]} de ${month[date[1] - 1]} de ${date[2]}`
  }
  return ''
}

function hourFormatted(defenseHour) {
  if (typeof defenseHour === 'string') {
    const hour = defenseHour
      .split(':')
      .join('h')
      .slice(0, 5)
    return hour
  }
  return ''
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
  overflow-y: scroll;
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
</style>
