<template>
  <aside id="asideBar" class="menu is-sidebar-menu asideBackground">
    <div class="menu-label text-uppercase">
      {{ courseTag ? courseTag : 'selecionar curso' }}
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
        <nuxt-link to="/subjects">Componentes Curriculares</nuxt-link>
      </li>
      <li>
        <ModalPrescribedList></ModalPrescribedList>
      </li>
      <li>
        <nuxt-link to="/config">Configurações</nuxt-link>
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
        <a href="#" @click.prevent="$emit('activateModal')">Importar Alunos</a>
      </li>
    </ul>
    <div class="menu-label">Usuários</div>
    <ul class="menu-list">
      <li>
        <nuxt-link to="/signup">Criar novo usuário</nuxt-link>
      </li>
      <li>
        <nuxt-link to="/updateUser">Atualizar usuário</nuxt-link>
      </li>
    </ul>
  </aside>
</template>

<script>
import { mapState } from 'vuex'
import ModalPrescribedList from '@/components/ModalPrescribedList'

export default {
  name: 'AsideBar',
  components: {
    ModalPrescribedList
  },
  computed: {
    ...mapState({
      courseTag: state => state.courseTag
    })
  }
}
</script>
