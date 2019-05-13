<template>
  <div class="container">
    <div v-if="courseTag && students.length > 0">
      <div class="columns">
        <div class="column is-centered is-half is-offset-one-quarter">
          <div class="control has-icons-left">
            <b-input
              v-model="studentSearch"
              placeholder="Buscar aluno"
              type="search"
              icon="magnify"
              rounded
            ></b-input>
          </div>
        </div>
      </div>
      <div class="columns">
        <div class="column is-centered is-half is-offset-one-quarter">
          <div v-if="students.length">
            <div v-if="searchStudentResult.length > 0">
              <b-table
                :striped="isStriped"
                :hoverable="isHoverabble"
                :data="searchStudentResult"
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
            <div v-else>
              Não há alunos ativos deste curso com a chave de pesquisa "{{
                studentSearch
              }}"
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!courseTag">Escolha um curso primeiro.</div>
    <div v-else-if="students.length === 0">Não há alunos nesta categoria.</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import studentComboBox from '../components/studentComboBox'
import '@nuxtjs/axios'

export default {
  name: 'Active',
  middleware: 'auth',

  components: {
    studentComboBox
  },

  data: () => ({
    studentSearch: '',
    selectedStudent: null,
    students: [],
    isStriped: true,
    isHoverabble: true,

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
    ]
  }),

  computed: {
    searchStudentResult() {
      return this.students.filter(st => {
        return st.name.indexOf(this.studentSearch.toUpperCase()) !== -1
      })
    },

    ...mapState({
      courseTag: state => state.courseTag
    })
  },

  mounted() {
    this.getStudents()
  },

  methods: {
    async getStudents() {
      try {
        this.students = await this.$axios.$get(
          `/api/students/?course=${this.courseTag}&isActive=1`
        )
      } catch (e) {
        this.$toast.open({
          message: this.errorMessage(e.response.data.code),
          type: 'is-danger'
        })
      }
    }
  }
}
</script>

<style scoped>
.container {
  margin: 20px auto 50px auto;
}
</style>
