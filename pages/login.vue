<template>
  <section class="hero has-background-grey is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <figure class="avatar">
            <img src="../assets/images/UFPA.png" width="200" height="100" />
          </figure>
          <h3 class="title has-text-white">Login</h3>
          <p class="subtitle has-text-white">Por favor faça o login</p>
          <div class="box">
            <form @submit.prevent="login">
              <div class="field">
                <div class="control">
                  <input
                    v-model="username"
                    class="input is-large"
                    type="text"
                    placeholder="Seu nome de usuário"
                    autofocus
                  />
                </div>
              </div>

              <div class="field">
                <div class="control">
                  <input
                    v-model="password"
                    class="input is-large"
                    type="password"
                    placeholder="Sua senha"
                  />
                </div>
              </div>
              <div class="field">
                <label class="checkbox">
                  <input v-model="remember" type="checkbox" />
                  Lembrar me
                </label>
              </div>
              <button
                class="button is-block is-info is-large is-fullwidth"
                type="submit"
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from 'vuex'
import { errorsHandler } from '@/components/mixins/errors'
export default {
  name: 'Login',
  layout: 'empty',
  mixins: [errorsHandler],
  head() {
    return {
      title: 'Login'
    }
  },
  data() {
    return {
      username: localStorage.getItem('lastLogin') || '',
      password: '',
      remember: false
    }
  },
  computed: {
    ...mapGetters({ user: 'auth/currentUser' })
  },
  methods: {
    async login() {
      try {
        await this.$store
          .dispatch('auth/login', {
            username: this.username,
            password: this.password
          })
          .then(() => {
            if (this.remember) {
              localStorage.setItem('lastLogin', this.username)
            }
          })
        if (this.user.role === 'admin') {
          this.$router.push('/')
        } else if (this.user.role === 'teacher') {
          this.$router.push('/teacher/home')
        }
      } catch (e) {
        const errorMessage = e.message
        if (errorMessage === 'Network Error') {
          this.openErrorNotification('Network Error')
        } else {
          this.$toast.open({
            message: 'Ocorreu uma falha na autenticação',
            type: 'is-danger'
          })
        }
      }
    }
  }
}
</script>
