<template>
  <div class="box">
    <header class="card-header">
      <b-icon pack="fas" :icon="icon()" size="is-small"></b-icon>
      <p class="card-header-title">
        Estudantes a {{ isAddition ? 'adicionar' : 'remover' }} da lista
      </p>
    </header>
    <b-table
      :data="students"
      :columns="columns"
      :checked-rows.sync="checkedStudents"
      checkable
    ></b-table>
    <div class="level">
      <div class="level-right">
        <div class="level-item">
          <button class="button is-primary" @click="confirmChange">
            Confirmar Alterações
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { errorsHandler } from '@/components/mixins/errors'
export default {
  name: 'EmailCompare',
  mixins: [errorsHandler],
  props: {
    students: {
      type: Array,
      default: () => []
    },
    mailingList: {
      type: String,
      default: ''
    },
    isAddition: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      columns: [
        { field: 'name', label: 'Nome' },
        { field: 'email', label: 'E-mail' }
      ],
      checkedStudents: []
    }
  },
  methods: {
    confirmChange() {
      this.$dialog.confirm({
        message:
          'Este processo é irreversivel, tem certeza que já foram realizadas todas as alterações?',
        onConfirm: () => {
          this.$services.students
            .updateEmailChanges(this.mailingList)
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
    },

    icon() {
      return this.isAddition ? 'plus-circle' : 'minus-circle'
    }
  }
}
</script>
