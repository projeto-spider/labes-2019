<template>
  <div
    id="main-container"
    class="is-flex has-direction-column is-viewport-height"
  >
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a
          href="#"
          role="button"
          class="navbar-burger burger"
          :class="{ 'is-active': showNavBurger }"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarItems"
          @click.prevent="showNavBurger = !showNavBurger"
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>

      <div
        id="navbarItems"
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
          <div class="navbar-item">
            <b-collapse :open="open" aria-id="asideCollapse">
              <a
                slot="trigger"
                href="#"
                role="button"
                class="navbar-burger burger"
                :class="{ 'is-active': active }"
                aria-label="menu"
                aria-expanded="false"
                aria-controls="asideCollapse"
                @click.prevent="toggleOpen"
              >
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
                <span aria-hidden="true"></span>
              </a>
              <AsideBar @activateModal="activateModal = true" />
            </b-collapse>
          </div>
        </div>
      </div>
    </nav>

    <div id="asideContainer" class="columns is-fullheight asideBackground">
      <div
        v-if="!isActive"
        class="column is-2"
        :class="{ 'is-hidden-mobile': !isActive }"
      >
        <AsideBar @activateModal="activateModal = true" />
      </div>
      <b-modal :active.sync="activateModal" :width="640" scroll="keep">
        <ImportStudents @import="onImport" />
      </b-modal>
      <div class="column has-background-grey-lighter">
        <nuxt ref="page" class="Fullscreen" />
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapGetters } from 'vuex'

import ImportStudents from '@/components/ImportStudents.vue'
import AsideBar from '@/components/AsideBar.vue'
export default {
  middleware: ['auth'],
  components: {
    ImportStudents,
    AsideBar
  },
  data() {
    return {
      active: this.isActive,
      activateModal: false,
      open: false,
      showNavBurger: this.showSideNavBurger
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
      return this.currrentUser.fullName || this.currrentUser.username
    },
    isActive() {
      return !window.innerWidth > 768
    },
    showSideNavBurger() {
      return window.innerWidth < 768
    }
  },
  methods: {
    toggleOpen() {
      this.open = !this.open
    },

    onImport() {
      window.location.reload(true)
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
#navbarItems {
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
  max-width: 75vw;
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
