<template>
  <div
    id="main-container"
    class="is-flex has-direction-column is-viewport-height"
  >
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a
          v-if="showSideNavBurger"
          href="#"
          role="button"
          class="navbar-burger burger is-marginless is-pulled-left"
          :class="{ 'is-active': active }"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          @click="active = !active"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
        <a
          href="#"
          role="button"
          class="navbar-burger burger"
          :class="{ 'is-active': showNavBurger }"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          @click="showNavBurger = !showNavBurger"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        id="navbarBasicExample"
        class="navbar-menu"
        :class="{ 'is-active': showNavBurger }"
      >
        <div class="navbar-start">
          <a href="#" class="navbar-item has-dropdown is-hoverable">
            <div class="navbar-link">
              {{ courseNameUppercase || 'Selecione um curso' }}
            </div>
            <div class="navbar-dropdown">
              <a href="#" class="navbar-item" @click="setCourseTag('cbcc')">
                CBCC
              </a>
              <a href="#" class="navbar-item" @click="setCourseTag('cbsi')">
                CBSI
              </a>
            </div>
          </a>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <div>
              <a class="button is-danger" @click="logout">
                Log out
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="columns is-fullheight">
      <div
        class="column is-2 has-background-black-ter"
        :class="{ 'is-hidden-mobile': !active }"
      >
        <aside class="menu is-sidebar-menu">
          <div class="menu-label text-uppercase">
            {{ courseTag ? courseTag : 'selecionar curso' }}
          </div>
          <ul class="menu-list">
            <li>
              <a href="#">Defesa de TCC</a>
            </li>
            <li>
              <a href="#">Formandos</a>
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
          </ul>

          <div class="menu-label">Grupos de Email</div>
          <ul class="menu-list">
            <li>
              <nuxt-link to="/emailList">Email</nuxt-link>
            </li>
            <li>
              <a href="#">Calouros</a>
            </li>
            <li>
              <a href="#">Newsletter</a>
            </li>
          </ul>
          <div class="menu-label">Importar</div>
          <ul class="menu-list">
            <li>
              <a href="#" @click="activateModal = true">Importar Alunos</a>
            </li>
          </ul>
        </aside>
      </div>
      <b-modal :active.sync="activateModal" :width="640" scroll="keep">
        <import-students />
      </b-modal>
      <div class="column has-background-grey-lighter">
        <nuxt class="Fullscreen" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

import ImportStudents from '../components/importStudents.vue'
export default {
  middleware: ['auth'],
  components: {
    ImportStudents
  },
  data() {
    return {
      active: this.isActive(),
      activateModal: false,
      showNavBurger: this.showSideNavBurger()
    }
  },

  computed: {
    ...mapState({
      courseTag: state => state.courseTag
    }),
    ...mapGetters({
      currrentUser: 'auth/currentUser'
    }),
    courseNameUppercase() {
      return this.courseTag && this.courseTag.toUpperCase()
    }
  },
  methods: {
    isActive() {
      return !window.innerWidth > 768
    },
    showSideNavBurger() {
      return window.innerWidth < 768
    },
    setCourseTag(tag) {
      this.$store.dispatch('courseTag', { tag })
    },

    logout() {
      this.$store.dispatch('courseTag', { tag: '' })
      this.$store.dispatch('auth/logout')
      this.$router.push('/login')
    },

    openSideBar: function() {
      this.active = !this.active
    }
  }
}
</script>

<style>
.is-viewport-height {
  height: 100vh;
}

.has-direction-column {
  flex-direction: column;
}

.align-content-stretch {
  align-content: stretch;
}

.is-sidebar-menu {
  padding: 1rem;
}

.columns .column {
  overflow-y: auto;
}

.columns .is-fullheight {
  flex: 1;
}
</style>
