<template>
  <div class="container">
    <search-input
      :key="courseTag"
      :default-course="courseTag"
      :title="'Alunos Concluintes'"
      :is-concluding="1"
    ></search-input>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchInput from '~/components/searchInput'

export default {
  name: 'Concluding',
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
