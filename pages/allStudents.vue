<template>
  <div class="container">
    <div v-if="courseTag" class="container">
      <h1>I am allStudents</h1>
    </div>
    <div v-else>Escolha um curso primeiro.</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: 'AllStudents',
  middleware: 'auth',

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
