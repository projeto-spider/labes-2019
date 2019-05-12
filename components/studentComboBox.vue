<template>
  <div class="card">
    <header class="card-header">
      <p class="card-header-title">
        {{ student.name }}
      </p>
      <a href="#" class="card-header-icon" aria-label="more options">
        <span class="icon">
          <i class="fas fa-angle-down" aria-hidden="true"></i>
        </span>
      </a>
    </header>
    <div class="card-content">
      <div class="content">
        <strong>Nome</strong> : {{ student.name }} <br />
        <strong>Matricula</strong> : {{ student.registrationNumber }} <br />
        <strong>E-mail</strong> : {{ student.email }} <br />
        <strong>Status</strong> : {{ displayStatus(student) }} <br />
        <strong>Pendências</strong> : {{ student.pendencies }} <br />
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
      // TODO FUNCAO PARA DIZER O STATUS DO ALUNO
    }
  }
}
</script>

<style></style>
