<template>
  <div class="container">
    <div class="columns is-centered">
      <h1 class="title"><strong>Alunos Formandos</strong></h1>
      <div class="level-right">
        <div class="level-item">
          <b-button class="is-primary">
            Gerar lista de prescrição
          </b-button>
        </div>
      </div>
    </div>
    <br />
    <search-input
      :key="courseTag"
      :default-course="courseTag"
      :title="'Graduandos Aptos'"
      :is-graduating="1"
      :show-defense-date="true"
      :is-fit="1"
    ></search-input>
    <br />
    <search-input
      :key="courseTag"
      :default-course="courseTag"
      :title="'Graduandos Não-Aptos'"
      :is-graduating="1"
      :show-defense-date="true"
      :is-fit="0"
    ></search-input>
    <br />
    <search-input
      :key="courseTag"
      :default-course="courseTag"
      :title="'Formando'"
      :is-graduating="1"
      :is-fit="1"
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
