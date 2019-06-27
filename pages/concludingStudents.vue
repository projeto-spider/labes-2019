<template>
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-5 is-offset-2">
        <h1 class="title">
          <strong>Alunos Concluintes</strong>
        </h1>
      </div>
    </div>
    <div class="columns">
      <div class="column is-3 is-offset-8 to-left">
        <b-button class="is-primary" @click="getAcademicHighlights">
          Gerar lista de destaques acadêmicos
        </b-button>
      </div>
    </div>
    <SearchInput
      :key="courseTag"
      :default-course="courseTag"
      :is-concluding="1"
    ></SearchInput>
    <b-modal :active.sync="activeModal">
      <div class="card">
        <header class="card-header">
          <b-icon pack="fas" icon="star" size="is-medium"></b-icon>
          <p class="card-header-title">Alunos destaque acadêmico:</p>
        </header>
        <div class="card-content">
          <div class="content">
            <table>
              <thead>
                <th scope="col">Nome</th>
                <th scope="col">Período</th>
              </thead>
              <tbody>
                <tr v-for="student in highlighted" :key="student.id">
                  <td>{{ student.name }}</td>
                  <td>{{ student.period || '-' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchInput from '~/components/SearchInput'
import { errorsHandler } from '../components/mixins/errors'

export default {
  name: 'Concluding',
  middleware: 'course',
  components: {
    SearchInput
  },
  mixins: [errorsHandler],
  data() {
    return {
      activeModal: false,
      highlighted: []
    }
  },
  computed: {
    ...mapState({
      courseTag: state => state.courseTag
    })
  },
  methods: {
    getAcademicHighlights() {
      this.$axios
        .get('/api/students/', {
          params: {
            isHighlighted: 1
          }
        })
        .then(response => {
          this.highlighted = response.data
          this.activeModal = true
        })
        .catch(e => this.openNotificationError(e))
    }
  }
}
</script>

<style scoped>
.container {
  margin: 50px auto 50px auto;
}

.to-left {
  position: relative;
  left: -10px;
}

.card-header {
  align-items: center;
}

.icon {
  margin-left: 1em;
}
</style>
