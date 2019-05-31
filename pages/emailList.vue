<template>
  <div class="container">
    <div v-if="courseTag" class="container">
      <export-email-list></export-email-list>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ExportEmailList from '~/components/exportEmailList'

export default {
  name: 'Email',
  middleware: 'auth',
  components: {
    ExportEmailList
  },

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
