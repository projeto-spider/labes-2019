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
import studentComboBox from '../components/studentComboBox'
import debounce from '../shared/debounce.js'
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
    }
  },

  mounted() {
    if (this.students.length < 1) {
      this.$toast.open({
        message: 'Não há alunos ativos neste curso',
        type: 'is-danger'
      })
    }
  },
  methods: {
    getStudentsFilters: debounce(() => {
      this.$axios
        .get('/api/students/', {
          params: {
            course: this.courseTag,
            isActive: 1
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
