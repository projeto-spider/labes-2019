<template>
  <div class="container">
    <div class="columns is-centered">
      <h1 class="title">
        <strong>{{ title }}</strong>
      </h1>
    </div>
    <br />
    <div class="columns is-centered">
      <div class="column is-half">
        <b-field horizontal class="box" label="Filtros: ">
          <b-checkbox v-model="nameFilter">Nome</b-checkbox>
          <b-checkbox v-model="registrationFilter">Matricula</b-checkbox>
          <b-checkbox v-model="emailFilter">Email</b-checkbox>
        </b-field>
        <b-input
          v-if="nameFilter"
          v-model="searchName"
          placeholder="Digite o nome"
          type="search"
          icon="search"
          rounded
          expanded
        >
        </b-input>
        <b-input
          v-if="registrationFilter"
          v-model="searchRegistration"
          placeholder="Digite a matricula"
          type="search"
          icon="search"
          rounded
          expanded
        >
        </b-input>
        <b-input
          v-if="emailFilter"
          v-model="searchEmail"
          placeholder="Digite o e-mail"
          type="email"
          icon="search"
          rounded
          expanded
        >
        </b-input>
        <br />
        <b-table
          v-if="students.length > 0"
          :striped="isStriped"
          :hoverable="isHoverabble"
          :data="studentsData"
          :selected.sync="selectedStudent"
          :columns="columns"
          focusable
        ></b-table>
        <b-modal :active.sync="selectedStudent" has-modal-card>
          <student-combo-box
            v-if="selectedStudent"
            :student="selectedStudent"
          ></student-combo-box>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import pDebounce from 'p-debounce'
import studentComboBox from '../components/studentComboBox'
export default {
  name: 'SearchInput',
  components: {
    studentComboBox
  },
  props: {
    title: {
      type: String,
      default: () => "Page's title"
    },
    students: {
      type: Array,
      default: () => []
    },
    isActive: {
      type: Number,
      default: () => 0
    }
  },
  data() {
    return {
      studentsData: [],
      searchName: '',
      searchRegistration: '',
      searchEmail: '',
      isStriped: true,
      isHoverabble: true,
      selectedStudent: null,
      columns: [
        {
          field: 'registrationNumber',
          label: 'Matrícula'
        },
        {
          field: 'name',
          label: 'Nome'
        },
        {
          field: 'email',
          label: 'Email'
        }
      ],
      filterOrderBy: false,
      nameFilter: false,
      registrationFilter: false,
      emailFilter: false
    }
  },

  computed: {
    ...mapState({
      courseTag: state => state.courseTag
    })
  },
  watch: {
    searchName() {
      this.getStudentsFilters()
    },
    searchRegistration() {
      this.getStudentsFilters()
    },
    searchEmail() {
      this.getStudentsFilters()
    },
    courseTag() {
      this.getStudentsFilters()
    },
    students() {
      this.studentsData = [...this.students]
    }
  },

  afterMounted() {
    if (this.students.length < 1 && this.defaultFilters.isActive === 1) {
      this.$toast.open({
        message: 'Não há alunos ativos neste curso',
        type: 'is-danger'
      })
    }
  },
  methods: {
    getStudentsFilters: pDebounce(function getStudentsFilters() {
      function maybeParam(key, value) {
        return value && { [key]: `%${value}%` }
      }
      this.$axios
        .get('/api/students/', {
          params: {
            course: this.courseTag,
            isActive: this.isActive !== 3 ? this.isActive : null,
            ...maybeParam('name', this.searchName),
            ...maybeParam('registrationNumber', this.searchRegistration),
            ...maybeParam('email', this.searchEmail)
          }
        })
        .then(res => {
          this.studentsData = res.data
        })
        .catch(() => {
          this.$toast.open({
            message: 'Falha ao carregar a lista de alunos.',
            type: 'is-danger'
          })
        })
    }, 500)
  }
}
</script>

<style scoped>
template {
  overflow-y: hidden;
}

.container {
  margin: 50px auto 50px auto;
}
</style>
