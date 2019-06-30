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
              <nuxt-link to="/teacher/home">Página inicial</nuxt-link>
              <nuxt-link to="/teacher/registerPresentation"
                >Cadastrar defesa de TCC</nuxt-link
              >
            </li>
          </ul>
        </aside>
      </div>
      <div class="column has-background-grey-lighter">
        <nuxt class="Fullscreen" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

export default {
  middleware: ['auth'],
  data() {
    return {
      active: this.isActive(),
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
