<template>
  <div class="container">
    <SearchInput title="Alunos totais" :is-active="false"></SearchInput>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchInput from '@/components/SearchInput'
export default {
  name: 'AllStudents',
  middleware: 'course',
  components: {
    SearchInput
  },
  head() {
    return {
      title: 'Todos os estudantes'
    }
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
