<template>
  <div class="container">
    <TccDefenseSearch
      ref="searchPending"
      title="Pendentes"
      status="pending"
      @move="handleMove"
    ></TccDefenseSearch>
    <br />
    <br />

    <TccDefenseSearch
      ref="searchAccepted"
      title="Aceitas"
      status="accepted"
      @move="handleMove"
    ></TccDefenseSearch>
    <br />
    <br />

    <TccDefenseSearch
      ref="searchDone"
      title="Realizadas"
      status="done"
      @move="handleMove"
    ></TccDefenseSearch>
  </div>
</template>

<script>
import TccDefenseSearch from '@/components/TccDefenseSearch'
import { mapState } from 'vuex'

export default {
  name: 'TccDefense',
  middleware: 'course',
  components: {
    TccDefenseSearch
  },
  head() {
    return {
      title: 'Labes - Defesa de TCC'
    }
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
