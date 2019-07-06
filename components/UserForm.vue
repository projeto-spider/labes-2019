<template>
  <div class="has-text-centered is-fullheight">
    <div class="column is-4 is-offset-4">
      <figure class="avatar">
        <img src="@/assets/images/UFPA.png" width="100" height="90" />
      </figure>
      <h3 class="title">
        {{ signUp ? 'Cadastro de Usuário' : 'Atualizar Usuário' }}
      </h3>
      <div class="box">
        <form v-if="signUp" @submit.prevent="register">
          <InputValidation
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
          </InputValidation>

          <InputValidation
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
          </InputValidation>

          <InputValidation
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
          </InputValidation>

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
          <button
            class="button is-block is-info is-large is-fullwidth"
            type="submit"
            :disabled="disabled"
          >
            Cadastrar
          </button>
        </form>
        <form v-else-if="update" @submit.prevent="updateUser">
          <InputValidation
            ref="usernameIpt"
            valid-message="Ok"
            :invalid-message="usernameError"
            :valid="validUserName"
          >
            <b-input
              v-model="username"
              type="text"
              maxlength="30"
              placeholder="Nome de usuário"
              @blur="onBlur('usernameIpt')"
            ></b-input>
          </InputValidation>

          <InputValidation
            ref="passwdIpt"
            valid-message="Ok"
            :invalid-message="passwdError"
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
          </InputValidation>
          <button
            class="button is-block is-info is-large is-fullwidth"
            type="submit"
            :disabled="disabledUpdate"
          >
            Atualizar
          </button>
        </form>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import InputValidation from '@/components/InputValidation'

export default {
  name: 'Signup',
  components: {
    InputValidation
  },
  props: {
    formType: {
      type: String,
      default: 'signup',
      validator(value) {
        return ['update', 'signup'].includes(value)
      }
    },
    user: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      username: '',
      password: '',
      email: '',
      role: null,
      usernameError: [
        'tamanho mínimo de 3 caracteres.',
        'Não pode conter espaços em branco.'
      ],
      passwdError: [
        'tamanho mínimo de 6 caracteres.',
        'Não pode conter espaços em branco.'
      ]
    }
  },

  computed: {
    ...mapGetters({ currentUser: 'auth/currentUser' }),
    disabled() {
      return !(
        this.validUserName &&
        this.validEmail &&
        this.validPassword &&
        this.role
      )
    },
    disabledUpdate() {
      return !(this.validUserName || this.validPassword)
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
    },
    signUp() {
      return this.formType === 'signup'
    },
    update() {
      return this.formType === 'update'
    }
  },
  created() {
    if (this.update) {
      if (this.user !== null) {
        this.username = this.user.username
      } else {
        this.username = this.currentUser.username
      }
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

    async register() {
      try {
        await this.$store.dispatch('auth/register', {
          email: this.email,
          username: this.username,
          password: this.password,
          role: this.role
        })
        this.clearInputs()
        this.$toast.open({
          message: 'Usuário cadastrado com sucesso',
          type: 'is-success'
        })
      } catch (e) {
        this.$toast.open({ message: 'Falha ao cadastrar', type: 'is-danger' })
      }
    },
    async updateUser() {
      let id = ''
      let username = ''
      let password = ''
      if (this.user !== null) {
        id = this.user.id
      } else {
        id = this.currentUser.id
      }
      if (this.username !== '') {
        username = this.username
      }
      if (this.password !== '') {
        password = this.password
      }
      try {
        await this.$store.dispatch('auth/update', {
          id: id,
          username: username,
          password: password
        })
        this.clearInputs()
        this.$toast.open({
          message: 'Usuário atualizado com sucesso',
          type: 'is-success'
        })
      } catch (e) {
        this.$toast.open({ message: e, type: 'is-danger' })
      }
    }
  }
}
</script>
