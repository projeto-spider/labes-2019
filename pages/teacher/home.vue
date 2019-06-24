<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Defesas de TCC pendentes</h1>
      <ul>
        <li
          v-for="(presentation, index) in registeredPresentations"
          :key="index"
        >
          <div class="box" style="width:30rem; margin:2em 0">
            {{ presentation }}
          </div>
        </li>
      </ul>
    </div>
  </section>
</template>

<script>
export default {
  name: 'TeacherHome',
  layout: 'defaultTeacher',
  data() {
    return {
      registeredPresentations: [1, 2, 3]
    }
  }
}
</script>

<style>
.container {
  height: 100vh;
}
</style>
