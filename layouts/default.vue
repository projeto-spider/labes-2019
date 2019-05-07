<template>
  <div
    id="main-container"
    class="is-flex has-direction-column is-viewport-height"
  >
    <nav class="navbar" role="navigation" aria-label="main navigation">
      <div class="navbar-brand">
        <a class="navbar-item has-dropdown is-hoverable">
          <div class="navbar-link">Curso</div>
          <div class="navbar-dropdown">
            <nuxt-link
              to="/allStudents"
              class="navbar-item"
              @click="setCourseTag('cbcc')"
            >
              CBCC
            </nuxt-link>
            <nuxt-link
              to="/allStudents"
              class="navbar-item"
              @click="setCourseTag('cbsi')"
            >
              CBSI
            </nuxt-link>
          </div>
        </a>

        <a
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

          <a class="navbar-item">Documentation</a>

          <div class="navbar-item has-dropdown is-hoverable">
            <a class="navbar-link">More</a>

            <div class="navbar-dropdown">
              <a class="navbar-item">About</a>
              <a class="navbar-item">Jobs</a>
              <a class="navbar-item">Contact</a>
              <hr class="navbar-divider" />
              <a class="navbar-item">Report an issue</a>
            </div>
          </div>
        </div>

        <div class="navbar-end">
          <div class="navbar-item">
            <div class="buttons">
              <a class="button is-primary">
                <strong>Sign up</strong>
              </a>
              <nuxt-link to="/login"> Log in </nuxt-link>
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
          <div class="menu-label text-uppercase">{{ courseTag }}</div>
          <ul class="menu-list">
            <li>
              <a>Defesa de TCC</a>
            </li>
            <li>
              <a>Formandos</a>
            </li>
            <li>
              <a>Concluintes</a>
            </li>
            <li>
              <a>Alunos Ativos</a>
            </li>
            <li>
              <nuxt-link to="/allStudents">Alunos Totais</nuxt-link>
            </li>
          </ul>

          <div class="menu-label">Grupos de Email</div>
          <ul class="menu-list">
            <li>
              <nuxt-link to="/emailList"> Email </nuxt-link>
            </li>
            <li>
              <a>Calouros</a>
            </li>
            <li>
              <a>Newsletter</a>
            </li>
          </ul>
          <div class="menu-label">Importar</div>
          <ul class="menu-list">
            <li>
              <nuxt-link to="importar/importarAlunos">
                Importar Alunos
              </nuxt-link>
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
export default {
  data() {
    return {
      active: this.isActive(),
      courseTag: 'cbcc'
    }
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
      this.courseTag = tag
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
