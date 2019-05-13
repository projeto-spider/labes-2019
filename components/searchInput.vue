<template>
  <div class="container">
    <div class="columns is-centered">
      <h1 class="title">
        <strong>{{ title }}</strong>
      </h1>
    </div>
    <br />
    <div v-if="students.length" class="columns is-centered">
      <div class="column is-half">
        <div class="control has-icons-left">
          <b-input
            v-model="search"
            placeholder="Buscar aluno"
            type="search"
            icon="search"
            rounded
          ></b-input>
        </div>
        <br />
        <b-table
          :striped="isStriped"
          :hoverable="isHoverabble"
          :data="students"
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
    parentPage: {
      type: String,
      default: () => ''
    }
  },
  data() {
    return {
      search: '',
      isStriped: true,
      isHoverabble: true,
      selectedStudent: null,
      columns: [
        {
          field: 'registrationNumber',
          label: 'Number'
        },
        {
          field: 'name',
          label: 'Name'
        },
        {
          field: 'email',
          label: 'Email'
        }
      ],
      filterOrderBy: false
    }
  },

  computed: {
    filteredList() {
      return this.students.filter(student => {
        return (
          student.name.toLowerCase().includes(this.search.toLowerCase()) ||
          student.email.toLowerCase().includes(this.search.toLowerCase()) ||
          student.registrationNumber
            .toLowerCase()
            .includes(this.search.toLowerCase())
        )
      })
    },
    defaultFilters() {
      switch (this.parentPage) {
        case 'activeStudents':
          return { isActive: 1 }
        case 'allStudents':
          return { isActive: 0 }
        default:
          return { isActive: 0 }
      }
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
    getStudentsFilters: pDebounce(() => {
      this.$axios
        .get('/api/students/', {
          params: {
            course: this.courseTag,
            isActive: this.defaultFilters.isActive
          }
        })
        .then(res => {
          this.students = res.data
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
.container {
  margin: 50px auto 50px auto;
}
</style>
