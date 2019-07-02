<template>
  <div class="container">
    <SearchInput
      :key="courseTag"
      :default-course="courseTag"
      :title="'Alunos Ativos'"
      :default-per-page="10"
      :is-active="true"
    ></SearchInput>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchInput from '@/components/SearchInput'

export default {
  name: 'Active',
  middleware: 'course',
  components: {
    SearchInput
  },
  head() {
    return {
      title: 'Labes - Ativos'
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
  },

  methods: {
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
