<template>
  <div class="container">
    <SearchInput
      :title="'Alunos totais'"
      :is-active="'AllStudents'"
    ></SearchInput>
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
