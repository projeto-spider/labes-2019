<template>
  <div class="box">
    <b-tabs position="is-centered" class="block">
      <b-tab-item label="Emails a serem adicionados">
        <b-table :data="studentsToAdd" :columns="columns"> </b-table>
      </b-tab-item>
      <b-tab-item label="Emails a serem removidos">
        <b-table :data="studentsToRemove" :columns="columns"> </b-table>
      </b-tab-item>
    </b-tabs>
    <div class="level">
      <div class="level-right">
        <div class="level-item">
          <button class="button is-primary" @click="confirmChanges">
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
  props: {
    studentsToAdd: {
      type: Object,
      default: () => {}
    },
    studentsToRemove: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      columns: [
        { field: 'name', label: 'Nome' },
        { field: 'email', label: 'E-mail' }
      ]
    }
  },
  methods: {
    confirmChanges() {
      this.$dialog.confirm({
        message:
          'Este processo é irreversivel, tem certeza que já foi realizado todas as alterações ?',
        onConfirm: () => {
          this.$parent.close()
          this.$toast.open('Alterações realizadas com sucesso')
        }
      })
    }
  }
}
</script>

<style></style>
