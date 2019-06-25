<template>
  <div class="container">
    <tcc-defense-search
      ref="searchPending"
      title="Pendentes"
      status="pending"
      @move="handleMove"
    ></tcc-defense-search>
    <br />
    <br />

    <tcc-defense-search
      ref="searchAccepted"
      title="Aceitas"
      status="accepted"
      @move="handleMove"
    ></tcc-defense-search>
    <br />
    <br />

    <tcc-defense-search
      ref="searchDone"
      title="Realizadas"
      status="done"
      @move="handleMove"
    ></tcc-defense-search>
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
  },

  methods: {
    handleMove() {
      const refs = [
        this.$refs.searchPending,
        this.$refs.searchAccepted,
        this.$refs.searchDone
      ]

      for (const ref of refs) {
        if (ref && ref.loadDefenses) {
          ref.loadDefenses()
        }
      }
    }
  }
}
</script>

<style scoped>
.container {
  margin: 50px auto 50px auto;
}
</style>
