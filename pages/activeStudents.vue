<template>
  <div class="container">
    <div v-if="courseTag" class="container">
      <div class="columns">
        <div class="column is-centered is-half">
          <b-input
            v-model="studentSearch"
            placeholder="Buscar Aluno"
            rounded
          ></b-input>
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
    studentSearch: ''
  }),

  computed: {
    ...mapState({
      courseTag: state => state.courseTag
    })
  }
}
</script>

<style scoped></style>
