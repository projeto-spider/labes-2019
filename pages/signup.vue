<template>
  <div class="hero has-background-grey has-text-centered is-fullheight">
    <div class="column is-4 is-offset-4">
      <figure class="avatar">
        <img src="../assets/images/UFPA.png" width="100" height="90" />
      </figure>
      <h3 class="title has-text-white">Cadastro de Usuário</h3>
      <div class="box">
        <form>
          <input-validation
            ref="emailIpt"
            valid-message="Ok"
            :invalid-message="['Email é obrigatório']"
            default-message="Campo obrigatório"
            :valid="validEmail"
          >
            <b-input
              v-model="email"
              type="text"
              placeholder="Email"
              @blur="onBlur('emailIpt')"
            ></b-input>
          </input-validation>

          <input-validation
            ref="usernameIpt"
            valid-message="Ok"
            :invalid-message="usernameError"
            default-message="Campo obrigatório"
            :valid="validUserName"
          >
            <b-input
              v-model="username"
              type="text"
              maxlength="30"
              placeholder="Nome de usuário"
              @blur="onBlur('usernameIpt')"
            ></b-input>
          </input-validation>

          <input-validation
            ref="passwdIpt"
            valid-message="Ok"
            :invalid-message="passwdError"
            default-message="Campo obrigatório"
            :valid="validPassword"
          >
            <b-input
              v-model="password"
              type="password"
              minlength="6"
              placeholder="Senha"
              password-reveal
              @blur="onBlur('passwdIpt')"
            >
            </b-input>
          </input-validation>

          <b-field>
            <b-select
              v-model="role"
              placeholder="Selecione um tipo de usuário"
              required
              expanded
            >
              <option value="admin">Administrador</option>
              <option value="teacher">Professor</option>
            </b-select>
          </b-field>
          <b-button
            class="button is-block is-info is-large is-fullwidth"
            :disabled="disabled"
            @click="signUp"
            @click.prevent
          >
            Cadastrar
          </b-button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import InputValidation from '@/components/InputValidation'

export default {
  name: 'Signup',
  components: {
    InputValidation
  },
  data() {
    return {
      username: '',
      password: '',
      email: '',
      role: null,
      usernameError: [
        'Nome de usuário obrigatório e tamanho mínimo de 3 caracteres.',
        'Não pode conter espaços em branco.'
      ],
      passwdError: [
        'Senha obrigatória e tamanho mínimo de 6 caracteres.',
        'Não pode conter espaços em branco.'
      ]
    }
  },
  head() {
    return {
      title: 'Cadastro de usuário'
    }
  },

  computed: {
    disabled() {
      return !(
        this.validUserName &&
        this.validEmail &&
        this.validPassword &&
        this.role
      )
    },

    validEmail() {
      const re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(this.email)
    },

    validUserName() {
      return (
        this.username.length <= 30 &&
        !this.username.includes(' ') &&
        this.username.length > 3
      )
    },

    validPassword() {
      return !this.password.includes(' ') && this.password.length > 5
    }
  },

  methods: {
    onBlur(refName) {
      this.$refs[refName].dirty = true
    },

    clearInputs() {
      this.username = ''
      this.password = ''
      this.email = ''
      this.role = null
      const refs = [
        this.$refs.emailIpt,
        this.$refs.usernameIpt,
        this.$refs.passwdIpt
      ]
      for (const ref of refs) {
        if (ref && ref.dirty) {
          ref.dirty = false
        }
      }
    },

    async signUp() {
      try {
        await this.$store.dispatch('auth/register', {
          email: this.email,
          username: this.username,
          password: this.password,
          role: this.role
        })
        this.clearInputs()
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
