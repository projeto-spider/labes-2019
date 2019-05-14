<template>
  <div class="container">
    <div v-if="courseTag" class="container">
      <h1>I am the email list</h1>
    </div>
    <div v-else>Escolha um curso primeiro.</div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Email',
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
