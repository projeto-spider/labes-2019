<template>
  <div class="box">
    <b-tabs position="is-centered" class="block">
      <b-tab-item label="Emails a serem adicionados">
        <b-table :data="studentsToAdd" :columns="columns"></b-table>
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
import { errorsHandler } from '../components/mixins/errors'
export default {
  name: 'EmailCompare',
  mixins: [errorsHandler],
  props: {
    studentsToAdd: {
      type: Array,
      default: () => []
    },
    studentsToRemove: {
      type: Array,
      default: () => []
    },
    mailingList: {
      type: String,
      default: () => ''
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
    confirmChange() {
      this.$dialog.confirm({
        message:
          'Este processo é irreversivel, tem certeza que já foi realizado todas as alterações ?',
        onConfirm: () => {
          this.$axios
            .post('/api/students/update-mailing-list', {
              mailingList: this.mailingList
            })
            .then(res => {
              this.$toast.open('Alterações realizadas com sucesso')
              this.$emit('email-list-changed')
            })
            .catch(error => {
              this.openErrorNotification(error)
            })
            .finally(() => {
              this.$parent.close()
            })
        }
      })
    }
  }
}
</script>

<style></style>
