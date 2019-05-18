<template>
  <div class="container">
    <search-input
      :title="'Alunos totais'"
      :students="students"
      :is-active="'AllStudents'"
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
  }
}
</script>

<style>
.container {
  height: 100vh;
}
</style>
