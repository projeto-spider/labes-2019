<template>
  <section class="section">
    <div class="container">
      <tcc-defense read-only="true"></tcc-defense>
    </div>
  </section>
</template>

<script>
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
  }
}
</script>

<style>
.container {
  height: 100vh;
}
</style>
