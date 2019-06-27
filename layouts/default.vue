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
          <div class="navbar-item">
            <div>
              <p>{{ courseNameExtended }}</p>
            </div>
          </div>
        </div>
        <div class="navbar-end">
          <div class="navbar-item">
            <div>
              <p>{{ username }}</p>
            </div>
          </div>
          <div class="navbar-item">
            <div>
              <a class="button is-danger" @click="logout">
                Sair
              </a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="columns is-fullheight asideBackground">
      <div class="column is-2" :class="{ 'is-hidden-mobile': !active }">
        <aside id="asideBar" class="menu is-sidebar-menu">
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
      </div>
      <b-modal :active.sync="activateModal" :width="640" scroll="keep">
        <ImportStudents />
      </b-modal>
      <div class="column has-background-grey-lighter">
        <nuxt class="Fullscreen" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

import ImportStudents from '../components/ImportStudents.vue'
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
    },
    courseNameExtended() {
      const enumName = {
        cbsi: 'Sistemas de Informação',
        cbcc: 'Ciência da Computação'
      }
      return enumName[this.courseTag] || ''
    },
    username() {
      return this.currrentUser.username
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
.asideBackground {
  background-color: #373737;
}

#asideBar ul li a {
  color: #aaaaaa;
}

.menu-label {
  text-align: center;
  font-weight: 700;
  border-radius: 5px;
  padding: 2px;
  background-color: #414141;
}

.navbar-brand,
#navbarBasicExample {
  color: #000;
  font-weight: 600;
}

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

.container.Fullscreen {
  height: unset;
  min-height: 100vh;
}
.container {
  margin: 4rem auto 4rem auto;
}

.slide-fade-vertical-enter-active,
.slide-fade-vertical-leave-active,
.slide-fade-horizontal-enter-active,
.slide-fade-horizontal-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-vertical-enter,
.slide-fade-vertical-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
.slide-fade-horizontal-enter,
.slide-fade-horizontal-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>
