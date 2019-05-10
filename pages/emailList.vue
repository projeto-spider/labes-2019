<template>
  <div class="container">
    <div v-if="courseTag" class="container">
      <h1>I am the email list</h1>
    </div>
    <div v-else>Escolha um curso primeiro.</div>
  </div>
</template>

<script>
export default {
  name: 'Email',
  middleware: 'auth'
}
</script>

<style>
.container {
  height: 100vh;
}
</style>
