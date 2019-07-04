<template>
  <div class="has-text-centered is-fullheight dtable">
    <div class="dcell">
      <div class="is-6 has-text-centered">
        <h1 class="title">Página não encontrada!</h1>
        <nuxt-link to="/">
          <h2>Volte à página inicial</h2>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Error',
  layout: 'empty'
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
