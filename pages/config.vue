<template>
  <div class="container">
    <p class="title has-text-centered">Configurações</p>
    <div class="box">
      <form @submit.prevent="handleSubmit">
        <b-field label="Nome do Diretor">
          <b-input v-model="directorName"></b-input>
        </b-field>
        <b-field label="Nome do Diretor do instituto">
          <b-input v-model="departamentDirectorName"></b-input>
        </b-field>
        <b-field label="Nome do Reitor">
          <b-input v-model="deanName"></b-input>
        </b-field>
        <b-field label="Período" message="formato : xxxx.[2,4]">
          <b-input
            v-model="term"
            message="something"
            pattern="[0-9]{4,4}\.[24]"
          ></b-input>
        </b-field>
        <button class="button is-primary">Atualizar</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
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
      term: ''
    }
  },
  computed: {
    ...mapGetters({
      currentDirectorName: 'config/getDirectorName',
      currentDepartamentDirectorName: 'config/getDepartamenteDirectorName',
      currentDeanName: 'config/getDeanName',
      currentTerm: 'config/getTerm'
    })
  },
  created() {
    // this.getConfigValues()
  },
  methods: {
    getConfigValues() {
      this.directorName = this.currentDirectorName
      this.departamentDirectorName = this.currentDepartamentDirectorName
      this.deanName = this.currentDeanName
      this.currentTerm = this.currentTerm
    },
    handleSubmit() {}
  }
}
</script>

<style></style>
