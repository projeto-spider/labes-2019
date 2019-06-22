<template>
  <div class="container">
    <tcc-defense-search :title="'Pendentes'"></tcc-defense-search>
  </div>
</template>

<script>
import TccDefenseSearch from '~/components/tccDefenseSearch'
import { mapState } from 'vuex'

export default {
  name: 'TccDefense',
  middleware: 'course',
  components: {
    TccDefenseSearch
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
