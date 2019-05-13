<template>
  <div class="card">
    <header class="card-header">
      <b-icon pack="fas" icon="user" size="is-medium"></b-icon>
      <p class="card-header-title">{{ student.name }}</p>
    </header>
    <div class="card-content">
      <div class="content">
        <div class="columns">
          <div class="column is-three-quarters">
            <strong>Nome</strong> : {{ student.name }} <br />
            <strong>Matricula</strong> : {{ student.registrationNumber }} <br />
            <strong>E-mail</strong> : {{ student.email }} <br />
            <strong>Status</strong> : {{ displayStatus() }} <br />
            <strong>Pendências</strong> : Só 500h <br />
          </div>
          <div class="column is-one-quarter">
            <div class="box">
              Ata :
              <span v-if="student">OK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StudentComboBox',
  props: {
    student: {
      type: Object,
      default: () => {}
    }
  },
  methods: {
    displayStatus() {
      return '"Sei não, hein?"'
    }
  }
}
</script>

<style></style>
