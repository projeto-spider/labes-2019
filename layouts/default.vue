<template>
  <div
    id="main-container"
    class="is-flex has-direction-column is-viewport-height"
  >
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a href="#" class="navbar-item has-dropdown is-hoverable">
          <div class="navbar-link">Alterar Curso</div>
          <div class="navbar-dropdown">
            <a href="#" class="navbar-item" @click="setCourseTag('cbcc')">
              CBCC
            </a>
            <a href="#" class="navbar-item" @click="setCourseTag('cbsi')">
              CBSI
            </a>
          </div>
        </a>

        <a
          href="#"
          role="button"
          class="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div id="navbarBasicExample" class="navbar-menu">
        <div class="navbar-start">
          <nuxt-link class="navbar-item" to="/">Home</nuxt-link>

          <a href="#" class="navbar-item">Documentation</a>

          <div class="navbar-item has-dropdown is-hoverable">
            <a href="#" class="navbar-link">More</a>

            <div class="navbar-dropdown">
              <a href="#" class="navbar-item">About</a>
              <a href="#" class="navbar-item">Jobs</a>
              <a href="#" class="navbar-item">Contact</a>
              <hr class="navbar-divider" />
              <a href="#" class="navbar-item">Report an issue</a>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a href="#" class="button is-primary">
                <strong>Sign up</strong>
              </a>
              <a href="#" @click="logout">Log out</a>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <div class="columns is-fullheight">
      <div
        class="column is-2 has-background-black-ter"
        :class="{ 'is-hidden-mobile': active }"
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
              <a href="#">Concluintes</a>
            </li>
            <li>
              <a href="#">Alunos Ativos</a>
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
      <div class="column has-background-grey-lighter">
        <nuxt class="Fullscreen" />
      </div>
      <div class="modal" :class="{ 'is-active': activateModal }">
        <div class="modal-background"></div>
        <div class="modal-content">
          <!-- Any other Bulma elements you want -->
        </div>
        <button
          class="modal-close is-large"
          aria-label="close"
          @click="activateModal = false"
        ></button>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      active: this.isActive(),
      activateModal: false
    }
  },

  computed: {
    ...mapState({
      courseTag: state => state.courseTag
    })
  },

  methods: {
    isActive: function() {
      if (window.innerWidth <= 1000) {
        return false
      } else {
        return true
      }
    },

    setCourseTag(tag) {
      this.$store.dispatch('courseTag', { tag })
      this.$router.push('/allStudents')
    },

    logout() {
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
$navbar-height: 3.25rem;

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

.columns {
  &.is-fullheight {
    flex: 1;

    .column {
      overflow-y: auto;
    }
  }
}
</style>
