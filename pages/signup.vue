<template>
  <div class="container has-text-centered">
    <div class="column is-4 is-offset-4">
      <figure class="avatar">
        <img src="../assets/images/UFPA.png" width="250" height="200" />
      </figure>
      <h3 class="title has-text-white">Cadastro de Usuário</h3>
      <div class="box">
        <form>
          <b-field label="Nome">
            <b-input v-model="name"></b-input>
          </b-field>

          <b-field label="Email">
            <b-input v-model="email" type="email" maxlength="30"> </b-input>
          </b-field>

          <b-field label="Nome de usuário">
            <b-input v-model="username" maxlength="30"></b-input>
          </b-field>

          <b-field label="Senha">
            <b-input v-model="password" type="password" password-reveal>
            </b-input>
          </b-field>
          <b-field label="Tipo usuário">
            <b-select placeholder="Selecione um tipo usuário" required expaned>
              <option value="flint">Administrador</option>
              <option value="silver">Professor</option>
            </b-select>
          </b-field>
          <button
            class="button is-block is-info is-large is-fullwidth"
            @click="signUp"
            @click.prevent
          >
            Cadastrar
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Signup',
  data() {
    return {
      name: '',
      password: '',
      email: '',
      role: ''
    }
  },
  methods: {
    async signUp() {
      try {
        await this.$store.dispatch('auth/register', {
          email: this.email,
          name: this.name,
          password: this.password,
          role: this.role
        })
        this.toast.open({
          message: 'Usuario cadastrado com sucesso',
          type: 'is-success'
        })
      } catch (e) {
        this.$toast.open({ message: 'Falha ao cadastrar', type: 'is-danger' })
      }
    }
  }
}
</script>
