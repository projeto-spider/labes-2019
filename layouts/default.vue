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
        <div class="navbar-start"></div>

        <div v-if="currentUser" class="navbar-end">
          <div class="navbar-item">
            <div>
              <p>
                {{ currentUser.email }}
              </p>
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
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'
import ImportStudents from '../components/importStudents.vue'
export default {
  components: {
    ImportStudents
  },
  data() {
    return {
      active: this.isActive(),
      activateModal: false
    }
  },

  computed: {
    ...mapState({
      courseTag: state => state.courseTag},
    ...mapGetters({
      currrentUser: 'auth/currentUser'
    })
  },

  methods: {
    isActive: function() {
      return window.innerWidth > 1000
    },

    setCourseTag(tag) {
      this.$store.dispatch('courseTag', { tag })
      this.$router.push('/allStudents')
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
