<template>
  <div class="box">
    <header v-if="displayChanges" class="card-header">
      <b-icon pack="fas" :icon="icon()" size="is-small"></b-icon>
      <p class="card-header-title">
        Estudantes a {{ isAddition ? 'adicionar' : 'remover' }} da lista
      </p>
    </header>
    <section v-if="displayChanges">
      <b-table
        :data="students"
        :columns="columns"
        :checked-rows.sync="checkedStudents"
        checkable
      ></b-table>
      <div class="level">
        <div class="level-left"></div>
        <div class="level-right">
          <div class="level-item btn-margin">
            <button class="button is-primary" @click="confirmChange">
              Confirmar Alterações
            </button>
          </div>
        </div>
      </div>
    </section>
    <section v-else class="dtable">
      <div class="has-text-centered dcell">
        <h1 class="title">Lorem ipsum</h1>
        <h2 class="subtitle">Dolor sit amet</h2>
      </div>
    </section>
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
    },
    displayChanges: {
      type: Boolean,
      default: false
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
          const ids = this.checkedStudents.map(stdt => stdt.id)
          this.$services.students
            .updateEmailChanges(ids, this.mailingList, this.isAddition)
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

<style>
.btn-margin {
  margin-top: 20px;
}

.dtable {
  width: 100%;
  height: 30vh;
  display: table;
}

.dcell {
  vertical-align: middle;
  display: table-cell;
}
</style>
