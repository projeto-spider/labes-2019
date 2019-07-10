<template>
  <div class="container form">
    <div class="column is-half is-pulled-right">
      <div class="card">
        <div class="card-content">
          <div class="column">
            <form @submit.prevent="sendSolicitation">
              <input-validation
                ref="nameIpt"
                input-label="Nome"
                default-message="Campo obrigatório"
                :invalid-message="['Mínimo de 9 caracteres']"
                valid-message="Ok"
                :valid="validName"
              >
                <b-input
                  v-model="name"
                  type="text"
                  @blur="onBlur('nameIpt')"
                ></b-input>
              </input-validation>

              <input-validation
                ref="emailIpt"
                input-label="Email"
                default-message="Campo obrigatório"
                :invalid-message="['Digite um endereço de email válido']"
                valid-message="Ok"
                :valid="validEmail"
              >
                <b-input
                  v-model="email"
                  type="text"
                  @blur="onBlur('emailIpt')"
                ></b-input>
              </input-validation>

              <input-validation
                ref="regIpt"
                input-label="Matrícula"
                default-message="Campo opcional"
                :invalid-message="['Deve ter 12 caracteres numéricos']"
                valid-message="Ok"
                :valid="validRegistration"
              >
                <b-input
                  v-model="registration"
                  type="text"
                  @blur="onBlur('regIpt')"
                ></b-input>
              </input-validation>

              <div v-if="currentRouteName !== 'concludingAdmission'">
                <b-field
                  label="Curso"
                  :message="{
                    'Campo Obrigatório': !dirty.registration
                  }"
                >
                </b-field>
                <div v-for="c in $options.courses" :key="c.id">
                  <div class="field">
                    <b-radio v-model="course" :native-value="c.id">
                      {{ c.name }}
                    </b-radio>
                  </div>
                </div>
                <br v-if="currentRouteName !== 'concludingAdmission'" />
                <b-field
                  v-if="currentRouteName !== 'concludingAdmission'"
                  label="Forma de Ingresso"
                  :message="{
                    'Campo Obrigatório': !dirty.registration
                  }"
                >
                </b-field>
                <div v-for="at in $options.admissionTypes" :key="at.id">
                  <div class="field">
                    <b-radio v-model="admissionType" :native-value="at.id">
                      {{ at.name }}
                    </b-radio>
                  </div>
                </div>
              </div>

              <div class="level-right">
                <b-button
                  class="is-primary level-item"
                  :disabled="!enabledButton"
                  native-type="submit"
                >
                  Enviar
                </b-button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { errorsHandler } from '@/components/mixins/errors'
import InputValidation from '@/components/InputValidation'

export default {
  name: 'AdmissionForm',
  components: {
    InputValidation
  },
  mixins: [errorsHandler],
  props: {
    mailingList: {
      type: String,
      default: ''
    }
  },
  courses: [
    { id: 'cbcc', name: 'Ciência da Computação' },
    { id: 'cbsi', name: 'Sistemas de Informação' },
    { id: 'other', name: 'Outro' }
  ],
  admissionTypes: [
    { id: 'psufpa', name: 'Processo Seletivo UFPa' },
    { id: 'sisu', name: 'SiSU' },
    { id: 'other', name: 'Outro' }
  ],
  data: () => ({
    name: '',
    email: '',
    registration: '',
    course: 'other',
    admissionType: 'other',
    dirty: {
      name: false,
      email: false,
      registration: false
    }
  }),
  computed: {
    validName() {
      return this.name.length >= 9
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
    },
    currentRouteName() {
      return this.$route.name
    }
  },

  methods: {
    onBlur(refName) {
      this.$refs[refName].dirty = true
    },

    clearRefsDirty() {
      const refs = Object.keys(this.$refs)
      for (const r of refs) {
        this.$refs[r].dirty = false
      }
    },

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
          this.course = 'cbcc'
          this.admissionType = 'psufpa'
          this.clearRefsDirty()
        })
        .catch(error => this.openErrorNotification(error.response.data.code))
    }
  }
}
</script>

<style>
.form {
  margin-top: -10vh;
}
</style>
