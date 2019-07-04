<template>
  <aside id="asideBar" class="menu is-sidebar-menu asideBackground">
    <div class="menu-label text-uppercase">
      {{ tag ? tag : 'selecionar curso' }}
    </div>
    <ul class="menu-list">
      <li>
        <nuxt-link to="/tccDefense">Defesas de TCC</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/formingStudents">Formandos</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/concludingStudents">Concluintes</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/activeStudents">Alunos Ativos</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/allStudents">Alunos Totais</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/subjects">Matérias</nuxt-link>
      </li>
    </ul>

    <div class="menu-label">Grupos de Email</div>
    <ul class="menu-list">
      <li>
        <nuxt-link to="/emailListActive">Email Principal</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/emailListFreshman">Calouros</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/emailListNewsletter">Newsletter</nuxt-link>
      </li>
    </ul>
    <div class="menu-label">Importar</div>
    <ul class="menu-list">
      <li>
        <a href="#" @click="activateModal = true">Importar Alunos</a>
      </li>
    </ul>
  </aside>
</template>

<script>
export default {
  name: 'AsideBar',
  props: {
    courseTag: {
      type: String,
      default: ''
    }
  },
  computed: {
    tag() {
      return this.courseTag
    }
  }
}
</script>
