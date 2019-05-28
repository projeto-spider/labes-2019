<template>
  <div class="container">
    <div class="columns is-centered capa">
      <div class="column texto-capa">
        <h1 class="title">Formulário de Admissão</h1>
      </div>
    </div>
    <div class="columns is-centered">
      <div class="column is-half">
        <b-field
          label="Nome"
          :message="{
            'Campo obrigatório': !name || nameError,
            ok: name && !nameError
          }"
          :type="{
            'is-danger': nameError,
            'is-success': !nameError && name
          }"
        >
          <b-input v-model="name" type="text"></b-input>
        </b-field>
        <b-field
          label="Email"
          :message="{
            'Campo obrigatório': !email,
            'Digite um endereço de email': email && emailError,
            ok: email && !emailError
          }"
          :type="{
            'is-danger': email && emailError,
            'is-success': email && !emailError
          }"
        >
          <b-input v-model="email"></b-input>
        </b-field>
        <b-field
          label="Matrícula"
          :message="{
            'Campo opcional': !registration,
            'Requer 12 caracteres numéricos': registrationError,
            ok: registration && !registrationError
          }"
          :type="{
            'is-danger': registrationError,
            'is-success': registration && !registrationError
          }"
        >
          <b-input v-model="registration" type="text"></b-input>
        </b-field>

        <div class="level-right">
          <div class="level-item">
            reCaptcha!
          </div>
          <b-button class="is-primary level-item" :disabled="disableButton"
            >Enviar</b-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Admission',
  data: () => ({
    name: '',
    nameError: false,
    email: '',
    emailError: false,
    registration: ''
  }),

  computed: {
    registrationError() {
      return !!this.registration && !/^[0-9]{12}$/.test(this.registration)
    },

    disableButton() {
      return (
        !this.name ||
        this.nameError ||
        !this.email ||
        this.emailError ||
        this.registrationError
      )
    }
  },

  watch: {
    name: function(newNameValue, oldNameValue) {
      this.nameError = this.checkError(newNameValue, oldNameValue)
    },

    email: function(newEmailValue, oldEmailValue) {
      this.emailError =
        this.checkError(newEmailValue, oldEmailValue) || !this.validEmail()
    }
  },

  methods: {
    checkError(value, previousValue) {
      return !value && previousValue
    },

    validEmail() {
      const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(this.email)
    }
  }
}
</script>

<style scoped>
.container {
  margin: 0px auto 50px auto;
}

.texto-capa {
  text-align: center;
  display: table-cell;
  vertical-align: middle;
}

.capa {
  width: 100%;
  height: 25%;
  display: table;
  background-color: #a588ad;
}
</style>
