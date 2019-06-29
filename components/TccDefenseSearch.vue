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
                    @click="modalOpen2"
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

        <div class="modal" :class="{ 'is-active': isActive }">
          <div class="modal-background"></div>
          <div class="modal-card">
            <header class="modal-card-head">
              <p class="modal-card-title">Modelo de divulgação</p>
              <button
                class="delete"
                aria-label="close"
                @click.stop.prevent="modalOpen2"
              ></button>
            </header>
            <section class="modal-card-body">
              <textarea v-model="disclosure" class="textarea"></textarea>
            </section>
            <footer class="modal-card-foot">
              <button class="button is-primary" @click="doCopy">
                Copiar
              </button>
              <button class="button" @click.stop.prevent="modalOpen2">
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

export default {
  name: 'TccDefenseSearch',

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
      isActive: false,
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
    }),
    disclosure() {
      return `
DEFESA PÚBLICA DO TRABALHO DE
CONCLUSÃO DO CURSO DE CIÊNCIA DA

COMPUTAÇÃO

Discente: ITALO RAMON DA COSTA CAMPOS

Título: APLICAÇÃO DE SISTEMAS MULTIAGENTES AO PROBLEMA
DE AUTORRECUPERAÇÃO EM SISTEMAS ELÉTRICOS DE
DISTRIBUIÇÃO DO TIPO SMART GRID

Banca:

Prof. Dr. Filipe de Oliveira Saraiva (ORIENTADOR)
Prof. Dr. Josivaldo de Souza Araujo (AVALIADOR)
Prof. Dr. Nelson Cruz Sampaio Neto (AVALIADOR)

Data e Local: 20 de dezembro de 2018 às 10:00 h - FC-02
RESUMO

Um dos setores mais importantes na vida da sociedade moderna é sem dúvida o setor de
energias e os seus sistemas de geração, transmissão, armazenamento e consumo. Esses
sistemas elétricos são complexos e difíceis de se gerenciar, requerendo aplicações de técnicas
sofisticadas para tornar o fornecimento de energia estável e minimamente confiável. Uma
área que muito vem sendo desenvolvida ao longo dos últimos anos é a de smart grids, que
incorpora à rede elétrica funcionalidades que melhoram a qualidade do serviço prestado,
como controle em tempo real dos dados gerados, comunicação digital entre as diferentes
partes do sistema, autorrecuperação frente à falhas, etc. Existem muitos trabalhos
desenvolvidos que se propõem a estudar o problema da autorrecuperação se utilizando de
diferentes técnicas. Esse se mostra um desafio que pode trazer à rede elétrica um grande
avanço no sentido de fornecer um serviço contínuo e de qualidade. No âmbito das redes
elétricas de distribuição, este trabalho propõe um modelo de sistema multiagente para lidar
com o problema da autorrecuperação das redes elétricas do tipo smart grids. Foi desenvolvido
um sistema multiagente para simular e gerenciar as operações, as falhas e a autorrecuperação
de redes elétricas. A autorrecuperação segue um algoritmo de quatro passos e realiza as
decisões com base num algoritmo de fluxo de potência. Para avaliar o sistema proposto,
foram utilizados dois modelos de rede elétrica: um primeiro concebido para esta pesquisa,
com 8 nós, e outro proposto no trabalho de Baran e Wu (1989), com 33 nós. Os resultados
foram obtidos através de simulação computacional e tabulados para análise. Tais resultados
mostram que o sistema multiagente é capaz de realizar a autorrecuperação da rede através da
      `
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
    },

    modalOpen2() {
      this.isActive = !this.isActive
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
