<template>
  <div class="hero has-background-grey has-text-centered is-fullheight">
    <div class="column is-4 is-offset-4">
      <figure class="avatar">
        <img src="../assets/images/UFPA.png" width="90" height="70" />
      </figure>
      <h3 class="title has-text-white">Cadastro de Usuário</h3>
      <div class="box">
        <form>
          <input-validation
            ref="emailIpt"
            :input-label="'Email'"
            :valid-message="'Ok'"
            :invalid-message="'email é obrigatório'"
            :default-message="'campo obrigatório'"
            :valid="validEmail()"
          >
            <b-input v-model="email" type="text" @blur="onEmailBlur"></b-input>
          </input-validation>

          <b-field label="Nome de usuário">
            <b-input v-model="username" maxlength="30"></b-input>
          </b-field>

          <b-field label="Senha">
            <b-input v-model="password" type="password" password-reveal>
            </b-input>
          </b-field>
          <b-field label="Tipo usuário">
            <b-select placeholder="Selecione um tipo usuário" required expaned>
              <option value="admin">Administrador</option>
              <option value="teacher">Professor</option>
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
import InputValidation from '@/components/InputValidation'

export default {
  name: 'Signup',
  layout: 'empty',
  components: {
    InputValidation
  },
  data() {
    return {
      username: '',
      password: '',
      email: '',
      role: ''
    }
  },
  head() {
    return {
      title: 'Cadastro de usuário'
    }
  },
  methods: {
    onEmailBlur() {
      this.$refs.emailIpt.dirty = true
    },

    validEmail() {
      const re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(this.email)
    },

    async signUp() {
      try {
        await this.$store.dispatch('auth/register', {
          email: this.email,
          username: this.username,
          password: this.password,
          role: this.role
        })
        this.$toast.open({
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
