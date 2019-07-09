<template>
  <div class="main">
    <section class="hero is-medium is-bold is-half is-pulled-left">
      <div class="hero-body is-centered">
        <h3 id="header" class="title">
          <span class="formulario">Formulário</span>
          <br />
          <span class="resto">de Ingresso</span>
        </h3>
      </div>
    </section>
    <nuxt />
  </div>
</template>

<style scoped>
.hero {
  margin: -1vh 0 0 10vw;
}
.hero-body {
  background-color: #2aae87;
}
.formulario {
  font-weight: 900;
  font-size: 150%;
  color: white;
}
.resto {
  font-weight: 200;
  color: white;
  font-family: 'Courier New', Courier, monospace;
}
</style>
<style>
html {
  min-width: 100vw;
  min-height: 100vh;
  background-image: linear-gradient(#68d8a6, #35c8c0);
}
</style>
