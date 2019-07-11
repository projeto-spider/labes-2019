<template>
  <div class="has-text-centered is-fullheight dtable">
    <div class="dcell">
      <div class="is-6 has-text-centered">
        <h1 class="title">Página não encontrada!</h1>
        <nuxt-link :to="isAdmin ? '/' : '/teacher/home'">
          <h2>Volte à página inicial</h2>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'Error',
  layout: 'empty',
  computed: {
    ...mapGetters({ currentUser: 'auth/currentUser' }),
    isAdmin() {
      return this.currentUser.role === 'admin'
    }
  }
}
</script>

<style scoped>
.dtable {
  background-color: #efefef;
  display: table;
  width: 100%;
  height: 100vh;
}

.dcell {
  display: table-cell;
  vertical-align: middle;
}
</style>
