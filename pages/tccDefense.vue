<template>
  <div class="container">
    <TccDefenseSearch
      ref="searchPending"
      title="Pendentes"
      status="pending"
      :read-only="readOnly"
      @move="handleMove"
    ></TccDefenseSearch>
    <br />
    <br />

    <TccDefenseSearch
      ref="searchAccepted"
      title="Aceitas"
      status="accepted"
      :read-only="readOnly"
      @move="handleMove"
    ></TccDefenseSearch>
    <br />
    <br />

    <TccDefenseSearch
      ref="searchDone"
      title="Realizadas"
      status="done"
      :read-only="readOnly"
      @move="handleMove"
    ></TccDefenseSearch>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import TccDefenseSearch from '@/components/TccDefenseSearch'

export default {
  name: 'TccDefense',
  middleware: 'course',
  components: {
    TccDefenseSearch
  },
  head() {
    return {
      title: 'Defesa de TCC'
    }
  },
  props: {
    readOnly: {
      type: Boolean,
      default: () => false
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
