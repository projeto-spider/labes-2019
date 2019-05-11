<template>
  <div class="container">
    <search-input
      :title="'Alunos totais'"
      :thead="head"
      :students="students"
    ></search-input>
  </div>
</template>

<script>
import SearchInput from '~/components/searchInput'
import axios from 'axios'
export default {
  name: 'AllStudents',
  components: {
    SearchInput
  },
  data() {
    return {
      head: ['Matrícula', 'Nome', 'Email'],
      students: []
    }
  },
  created() {
    axios
      .get('/api/students/')
      .then(res => {
        this.students = res.data
      })
      .catch(err => {
        alert(err)
      })
  }
}
</script>

<style>
.container {
  height: 100vh;
}
</style>
