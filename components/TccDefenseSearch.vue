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
                    <p>???</p>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="readOnly === false" class="card-buttons">
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
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import pDebounce from 'p-debounce'
import { errorsHandler } from '@/components/mixins/errors'
import DefenseForm from '@/components/DefenseForm'

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
    },
    readOnly: {
      type: Boolean,
      default: () => false
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
            type: 'is-danger'
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
          type: 'is-success'
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
          type: 'is-success'
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

.card-buttons {
  position: absolute;
  right: 0;
  bottom: -40px;
}
</style>
