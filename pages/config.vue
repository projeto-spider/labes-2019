<template>
  <div class="container">
    <p class="title has-text-centered">Configurações</p>
    <div class="box">
      <label class="label">Nome do Diretor</label>
      <b-field>
        <b-input v-model="directorName" expanded></b-input>
        <button expanded class="button is-primary" @click="submitDirectorName">
          Atualizar
        </button>
      </b-field>
      <label class="label">Nome do Diretor do instituto</label>
      <b-field>
        <b-input v-model="departamentDirectorName" expanded></b-input>
        <button
          class="button is-primary"
          @click="submitDepartamentDirectorName"
        >
          Atualizar
        </button>
      </b-field>
      <label class="label">Nome do Reitor</label>
      <b-field>
        <b-input v-model="deanName" expanded></b-input>
        <button class="button is-primary" @click="submitDeanName">
          Atualizar
        </button>
      </b-field>
      <label class="label">Período</label>
      <b-field>
        <b-input
          v-model="term"
          expanded
          message="something"
          pattern="[0-9]{4,4}\.[1-4]"
        ></b-input>
        <button class="button is-primary" @click="submitTerm">Atualizar</button>
      </b-field>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Config',
  head() {
    return {
      title: 'Configurações'
    }
  },
  data() {
    return {
      directorName: '',
      departamentDirectorName: '',
      deanName: '',
      term: '',
      currentDirectorName: '',
      currentDepartamentDirectorName: '',
      currentTerm: '',
      currentDeanName: ''
    }
  },
  created() {
    this.$services.config.fetch('currentTerm').then(res => {
      this.currentTerm = res.data.value
      this.term = res.data.value
    })
    this.$services.config.fetch('facultyDirectorName').then(res => {
      this.currentDirectorName = res.data.value
      this.directorName = res.data.value
    })
    this.$services.config.fetch('deanName').then(res => {
      this.currentDeanName = res.data.value
      this.deanName = res.data.value
    })
    this.$services.config.fetch('departamentDirector').then(res => {
      this.currentDepartamentDirectorName = res.data.value
      this.departamentDirectorName = res.data.value
    })
  },
  methods: {
    getConfigValues() {
      this.directorName = this.currentDirectorName
      this.departamentDirectorName = this.currentDepartamentDirectorName
      this.deanName = this.currentDeanName
      this.term = this.currentTerm
    },
    submitTerm() {
      if (this.term !== this.currentTerm) {
        this.$services.config
          .updateTerm(this.term)
          .then(res => {
            this.term = res.data.value
            this.$toast.open({
              type: 'is-success',
              message: 'Atualizado com sucesso.'
            })
          })
          .catch(e => {
            this.$toast.open({
              type: 'is-danger',
              message: 'Falha ao atualizar a configuração'
            })
          })
      } else {
        this.$toast.open({
          type: 'is-warning',
          message: 'valor não foi alterado por serem iguais.'
        })
      }
    },
    submitDirectorName() {
      if (this.directorName !== this.currentDirectorName) {
        this.$services.config
          .updateFacultyDirectorName(this.directorName)
          .then(res => {
            this.directorName = res.data.value
            this.$toast.open({
              type: 'is-success',
              message: 'Atualizado com sucesso.'
            })
          })
          .catch(e => {
            this.$toast.open({
              type: 'is-danger',
              message: 'Falha ao atualizar a configuração'
            })
          })
      } else {
        this.$toast.open({
          type: 'is-warning',
          message: 'valor não foi alterado por serem iguais.'
        })
      }
    },
    submitDepartamentDirectorName() {
      if (
        this.departamentDirectorName !== this.currentDepartamentDirectorName
      ) {
        this.$services.config
          .updateDepartamentDirector(this.departamentDirectorName)
          .then(res => {
            this.departamentDirectorName = res.data.value
            this.$toast.open({
              type: 'is-success',
              message: 'Atualizado com sucesso.'
            })
          })
          .catch(e => {
            this.$toast.open({
              type: 'is-danger',
              message: 'Falha ao atualizar a configuração'
            })
          })
      } else {
        this.$toast.open({
          type: 'is-warning',
          message: 'valor não foi alterado por serem iguais.'
        })
      }
    },
    submitDeanName() {
      if (this.deanName !== this.currentDeanName) {
        this.$services.config
          .updateDeanName(this.deanName)
          .then(res => {
            this.deanName = res.data.value
            this.$toast.open({
              type: 'is-success',
              message: 'Atualizado com sucesso.'
            })
          })
          .catch(e => {
            this.$toast.open({
              type: 'is-danger',
              message: 'Falha ao atualizar a configuração'
            })
          })
      } else {
        this.$toast.open({
          type: 'is-warning',
          message: 'valor não foi alterado por serem iguais.'
        })
      }
    }
  }
}
</script>

<style></style>
