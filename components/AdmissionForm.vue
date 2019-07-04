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

        <b-field
          label="Curso"
          :message="{
            'Campo Obrigatório': !dirty.registration
          }"
        >
        </b-field>
        <div v-for="c in $options.courses" :key="c.id">
          <div class="field">
            <b-radio v-model="course" :native-value="c.name">
              {{ c.name }}
            </b-radio>
          </div>
        </div>
        <br />
        <b-field
          label="Forma de Ingresso"
          :message="{
            'Campo Obrigatório': !dirty.registration
          }"
        >
        </b-field>
        <div v-for="at in $options.admissionTypes" :key="at.id">
          <div class="field">
            <b-radio v-model="admissionType" :native-value="at.name">
              {{ at.name }}
            </b-radio>
          </div>
        </div>
        <div class="level-right">
          <b-button
            class="is-primary level-item"
            :disabled="!enabledButton"
            @click="sendSolicitation"
          >
            Enviar
          </b-button>
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

  courses: [
    { id: 1, name: 'Ciência da Computação' },
    { id: 2, name: 'Sistemas de Informação' }
  ],
  admissionTypes: [
    { id: 1, name: 'Processo Seletivo UFPa' },
    { id: 2, name: 'SiSU' }
  ],

  data: () => ({
    name: '',
    email: '',
    registration: '',
    course: 1,
    admissionType: 1,
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
          type: this.mailingList,
          course: this.course,
          admissionType: this.admissionType
        })
        .then(response => {
          this.$toast.open({
            message: 'Solicitação realizada com sucesso!',
            type: 'is-success'
          })
          this.name = ''
          this.email = ''
          this.registration = ''
          this.course = 1
          this.admissionType = 1
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
