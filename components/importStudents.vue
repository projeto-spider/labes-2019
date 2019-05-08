<template>
  <div class="card">
    <div class="card-header">
      <p class="card-header-title">
        Importar Alunos
      </p>
    </div>
    <div class="card-content">
      <b-field class="file">
        <b-upload v-model="studentsCsvList" @input="validateCSV">
          <a class="button is-primary">
            <b-icon icon="upload"></b-icon>
            <span>Selecione um arquivo</span>
          </a>
        </b-upload>
        <span v-if="studentsCsvList" class="file-name">
          {{ studentsCsvList.name }}
        </span>
      </b-field>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ImportStudents',
  data() {
    return {
      studentsCsvList: ''
    }
  },
  methods: {
    print() {
      // eslint-disable-next-line no-console
      console.log(this.studentsCsvList)
    }
  }
}
</script>

<style></style>
