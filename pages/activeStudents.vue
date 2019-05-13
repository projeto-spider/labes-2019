<template>
  <div class="container">
    <search-input
      :title="'Alunos Ativos'"
      :students="students"
      :parent-page="'activeStudents'"
    ></search-input>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchInput from '~/components/searchInput'

export default {
  name: 'Active',
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

  mounted() {
    this.getStudents()
  },

  methods: {
    async getStudents() {
      try {
        this.students = await this.$axios.$get('/api/students/', {
          params: {
            course: this.courseTag,
            isActive: 1
          }
        })
      } catch (e) {
        this.openErrorNotification(e.response.data.code)
      }
    },
    errorMessage(errorCode) {
      switch (errorCode) {
        case 'IMPORT_CSV_INVALID_LENGHT':
          return 'Arquivo csv com tamanho de linha invalido'
        case 'IMPORT_CSV_INVALID_HEADER':
          return 'Arquivo csv com nome de cabecalho invalido'
        case 'IMPORT_CSV_INVALID_COL_NUMBER':
          return 'Arquivo csv com numero invalido de colunas'
        case 'IMPORT_CSV_INVALID_FILE':
          return 'Por favor selecione um arquivo do tipo csv'
        default:
          return 'Ocorreu um erro'
      }
    },
    openErrorNotification(errorCode) {
      this.$notification.open({
        duration: 5000,
        message: this.errorMessage(errorCode),
        position: 'is-top',
        type: 'is-danger',
        hasIcon: true
      })
    }
  }
}
</script>
