<template>
  <div class="container">
    <search-input
      :title="'Alunos totais'"
      :students="students"
      :is-active="0"
    ></search-input>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchInput from '~/components/searchInput'
export default {
  name: 'AllStudents',
  middleware: 'course',
  components: {
    SearchInput
  },
  data() {
    return {
      head: ['Matrícula', 'Nome', 'Email'],
      students: []
    }
  },
  computed: {
    ...mapState({
      courseTag: state => state.courseTag
    })
  },
  created() {
    this.$axios
      .get('/api/students/', {
        params: {
          course: this.courseTag
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
  }
}
</script>

<style>
.container {
  height: 100vh;
}
</style>
