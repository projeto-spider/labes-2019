<template>
  <div class="container">
    <div class="columns is-centered">
      <div class="column is-half">
        <div class="level">
          <div class="level-item">
            <h1 class="title"><strong>Alunos Formandos</strong></h1>
          </div>
          <div class="level-right">
            <div class="level-item">
              <b-button class="is-primary">
                Gerar lista de prescrição
              </b-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <search-input
      :key="courseTag"
      :default-course="courseTag"
      :title="'Graduandos Aptos'"
      :is-graduating="1"
      :show-defense-date="true"
      :is-fit="1"
    ></search-input>
    <search-input
      :key="courseTag"
      :default-course="courseTag"
      :title="'Graduandos Não-Aptos'"
      :is-graduating="1"
      :show-defense-date="true"
      :is-fit="0"
    ></search-input>
    <search-input
      :key="courseTag"
      :default-course="courseTag"
      :title="'Formando'"
      :is-forming="1"
    ></search-input>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import SearchInput from '~/components/searchInput'

export default {
  name: 'Forming',
  middleware: 'course',
  components: {
    SearchInput
  },
  computed: {
    ...mapState({
      courseTag: state => state.courseTag
    })
  }
}
</script>

<style scoped>
.container {
  margin: 50px auto 50px auto;
}
</style>
