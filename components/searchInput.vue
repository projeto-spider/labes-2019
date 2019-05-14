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
          v-if="filteredList.length > 0"
          :striped="isStriped"
          :hoverable="isHoverabble"
          :data="filteredList"
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
    isActive: {
      type: Number,
      default: () => 0
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

  watch: {
    filteredList: function() {
      if (this.filteredList.length < 1 && this.students.length > 0) {
        this.$toast.open({
          message: `Não há alunos que correspondam a chave de pesquisa ${
            this.search
          }`,
          type: 'is-danger'
        })
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
    getStudentsFilters: pDebounce(function getStudentsFilters() {
      this.$axios
        .get('/api/students/', {
          params: {
            course: this.courseTag,
            isActive: this.isActive
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
template {
  overflow-y: hidden;
}

.container {
  margin: 50px auto 50px auto;
}
</style>
