<template>
  <div class="container topper-margin">
    <div class="columns is-centered">
      <div class="column is-half">
        <b-field
          label="Nome"
          :message="{
            'Campo obrigatório': !dirty.name,
            [validName ? 'ok' : `Mínimo de 9 caracteres`]: dirty.name
          }"
          :type="{
            [validName ? 'is-success' : 'is-danger']: dirty.name
          }"
        >
          <b-input
            v-model="name"
            type="text"
            @blur="dirty.name = true"
          ></b-input>
        </b-field>

        <b-field
          label="Email"
          :message="{
            'Campo obrigatório': !dirty.email,
            [validEmail ? 'ok' : 'Digite um endereço de email']: dirty.email
          }"
          :type="{
            [validEmail ? 'is-success' : 'is-danger']: dirty.email
          }"
        >
          <b-input
            v-model="email"
            type="text"
            @blur="dirty.email = true"
          ></b-input>
        </b-field>

        <b-field
          label="Matrícula"
          :message="{
            'Campo opcional': !dirty.registration,
            [validRegistration
              ? 'ok'
              : 'Deve ter 12 caracteres numéricos']: dirty.registration
          }"
          :type="{
            [validRegistration ? 'is-success' : 'is-danger']: dirty.registration
          }"
        >
          <b-input
            v-model="registration"
            type="text"
            @blur="dirty.registration = true"
          ></b-input>
        </b-field>

        <div class="level-right">
          <div class="level-item">
            reCaptcha!
          </div>
          <b-button
            class="is-primary level-item"
            :disabled="!enabledButton"
            @click="sendSolicitation"
            >Enviar</b-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { errorsHandler } from '@/components/mixins/errors'

export default {
  name: 'AdmissionForm',
  mixins: [errorsHandler],
  props: {
    mailingList: {
      type: String,
      default: () => ''
    }
  },

  data: () => ({
    name: '',
    email: '',
    registration: '',
    dirty: {
      name: false,
      email: false,
      registration: false
    }
  }),

  computed: {
    validName() {
      return this.dirty.name && this.name.length >= 9
    },

    validEmail() {
      const re = /^(([^<>()\\[\]\\.,;:\s@"]+(\.[^<>()\\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      return re.test(this.email)
    },

    validRegistration() {
      return !this.registration || /^[0-9]{12}$/.test(this.registration)
    },

    enabledButton() {
      return this.validName && this.validEmail && this.validRegistration
    }
  },

  methods: {
    sendSolicitation() {
      this.$services.solicitations
        .create({
          name: this.name,
          email: this.email,
          ...(this.registration && { registrationNumber: this.registration }),
          type: this.mailingList
        })
        .then(response => {
          this.$toast.open({
            message: 'Solicitação realizada com sucesso!',
            type: 'is-success'
          })
          this.name = ''
          this.email = ''
          this.registration = ''
          this.dirty.name = ''
          this.dirty.email = ''
          this.dirty.registration = ''
        })
        .catch(error => this.openErrorNotification(error.response.data.code))
    }
  }
}
</script>

<style>
.topper-margin {
  margin-top: 30px;
}
</style>
