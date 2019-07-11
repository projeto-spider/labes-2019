<template>
  <section class="section">
    <div v-if="showDefenses" class="container">
      <tcc-defense :read-only="true"></tcc-defense>
    </div>
    <div v-else class="container">
      <div class="box has-text-centered">
        <p class="title is-warning">Por favor, selecione um curso.</p>
      </div>
    </div>
  </section>
</template>

<script>
import { mapState } from 'vuex'
import TccDefense from '~/pages/tccDefense'
export default {
  name: 'TeacherHome',
  layout: 'defaultTeacher',
  components: {
    TccDefense
  },
  data() {
    return {
      registeredPresentations: []
    }
  },
  computed: {
    ...mapState({
      courseTag: state => state.courseTag
    }),
    showDefenses() {
      return !(this.courseTag === '')
    }
  }
}
</script>

<style>
.container {
  height: 100vh;
}
</style>
