<template>
  <div class="box">
    <b-tabs position="is-centered" class="block">
      <b-tab-item label="Emails a serem adicionados">
        <div v-for="student in students" :key="student.id">{{ student }}</div>
      </b-tab-item>
      <b-tab-item label="Emails a serem removidos"></b-tab-item>
    </b-tabs>
    <div class="level">
      <div class="level-right">
        <div class="level-item">
          <button class="button is-primary">
            Confirmar Alterações
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EmailCompare',
  data() {
    return {
      students: [
        { id: 1, name: 'something1', email: 'something@something.br' },
        { id: 2, name: 'something1', email: 'something@something.br' }
      ]
    }
  }
}
</script>

<style></style>
