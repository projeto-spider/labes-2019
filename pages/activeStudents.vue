<template>
  <div class="container">
    <div v-if="courseTag">
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
          <b-table :data="searchStudentResult" :columns="columns"></b-table>
        </div>
      </div>
    </div>
    <div v-else>Escolha um curso primeiro.</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'Active',
  middleware: 'auth',

  data: () => ({
    studentSearch: '',
    students: [
      {
        number: '111122223330',
        name: 'Student 1',
        email: 'student1@ufpa.br'
      },
      {
        number: '111122223331',
        name: 'Student 2',
        email: 'student2@ufpa.br'
      },
      {
        number: '111122223332',
        name: 'Student 2',
        email: 'student2@ufpa.br'
      },
      {
        number: '111122223333',
        name: 'Student 3',
        email: 'student3@ufpa.br'
      }
    ],

    columns: [
      {
        field: 'number',
        label: 'Number',
        width: '40'
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
        return st.name.indexOf(this.studentSearch) !== -1
      })
    },

    ...mapState({
      courseTag: state => state.courseTag
    })
  }
}
</script>

<style scoped>
.container {
  margin: 20px auto 50px auto;
}
</style>
