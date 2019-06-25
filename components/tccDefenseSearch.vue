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
          placeholder="   Digite o nome"
          type="search"
          icon="search"
          rounded
          expanded
        >
        </b-input>
        <br />
        <b-table
          :striped="true"
          :hoverable="true"
          :data="defenses"
          :columns="columns"
          class="searchInputTable"
          focusable
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
                </div>
                <div class="columns scrollable-modal">
                  <div class="column is-left is-half">
                    <p>Informações da defesa</p>
                    <DefenseForm
                      v-if="modalOpen"
                      v-model="selectedDefense"
                      :on-submit="onSubmit"
                    />
                  </div>
                  <div class="column is-right is-half">
                    <p>Documentos gerados</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { errorsHandler } from './mixins/errors'
import DefenseForm from './defenseForm'

export default {
  name: 'TccDefenseSearch',

  components: {
    DefenseForm
  },
  mixins: [errorsHandler],

  props: {
    publish: {
      type: Boolean,
      default: () => false
    },

    title: {
      type: String,
      default: () => ''
    },

    status: {
      type: String,
      required: false,
      default: undefined
    }
  },

  data() {
    return {
      total: 0,
      totalPages: 0,
      page: 1,
      perPage: 10,
      defenses: [],
      modalOpen: false,
      selectedDefense: false,
      searchStudentName: '',
      course: '',
      registration: '',
      tccStudents: [],
      defenseLocal: '',
      defenseDate: null,
      defenseTime: null,
      tccTitle: '',
      keywords: '',
      abstract: '',
      advisor: '',
      coAdvisor: '',
      eval1: '',
      eval2: '',
      eval3: '',
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
      courseTag: state => state.courseTag
    })
  },

  created() {
    this.loadDefenses()
  },

  methods: {
    selectDefense(row) {
      this.modalOpen = true
      this.selectedDefense = row
    },

    loadDefenses() {
      const { courseTag, status, page = 1 } = this

      const config = { params: { page, course: courseTag, status } }
      return this.$axios
        .get('/api/defenses', config)
        .then(res => {
          this.defenses = res.data
          this.total = +res.headers['pagination-row-count']
          this.perPage = +res.headers['pagination-page-size']
        })
        .catch(() => {
          this.$toast.open({
            message: 'Falha ao carregar a lista de defesas.',
            type: 'is-danger'
          })
        })
    },

    onPageChange(page) {
      this.page = page
      this.loadDefenses()
    },

    onSubmit(payload) {
      const endpoint = `/api/defenses/${payload.id}`
      return this.$axios
        .$put(endpoint, payload)
        .then(updated => {
          this.$toast.open({
            message: 'Solicitação atualizada com sucesso!',
            type: 'is-success'
          })

          const original = this.defenses.find(
            defense => defense.id === updated.id
          )

          if (original) {
            Object.assign(original, updated)
          }
        })
        .catch(error => this.openErrorNotification(error.response.data.code))
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

.scrollable-modal {
  overflow-y: scroll;
  height: 500px;
}
</style>
