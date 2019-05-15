<template>
  <section class="hero has-background-grey is-fullheight">
    <div class="hero-body">
      <div class="container has-text-centered">
        <div class="column is-4 is-offset-4">
          <figure class="avatar">
            <img src="../assets/images/UFPA.png" width="250" height="200" />
          </figure>
          <h3 class="title has-text-white">Login</h3>
          <p class="subtitle has-text-white">Por favor faça o login</p>
          <div class="box">
            <form>
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
                  <input type="checkbox" />
                  Lembrar me
                </label>
              </div>
              <button
                class="button is-block is-info is-large is-fullwidth"
                @click="login"
                @click.prevent
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
export default {
  name: 'Login',
  layout: 'empty',
  data() {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    async login() {
      try {
        await this.$store.dispatch('auth/login', {
          username: this.username,
          password: this.password
        })
        this.$router.push('/')
      } catch (e) {
        this.$toast.open({ message: 'Falha ao autenticar', type: 'is-danger' })
      }
    }
  }
}
</script>
