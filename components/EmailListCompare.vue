<template>
  <div class="box">
    <header v-if="displayChanges && students.length" class="card-header">
      <b-icon pack="fas" :icon="icon" size="is-small"></b-icon>
      <p class="card-header-title">
        Estudantes a {{ isAddition ? 'adicionar' : 'remover' }} da lista
      </p>
    </header>
    <section v-if="displayChanges && students.length">
      <b-table
        :data="students"
        :columns="columns"
        :checked-rows.sync="checkedChanges"
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
        <h1 class="title">Nada para mostrar ainda!</h1>
        <h2 class="subtitle">Selecione algum botão abaixo</h2>
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
      checkedChanges: []
    }
  },

  computed: {
    icon() {
      return this.isAddition ? 'plus-circle' : 'minus-circle'
    }
  },

  methods: {
    filterIds(type) {
      return this.checkedChanges
        .filter(change => change.type === type)
        .map(change => change.id)
    },

    confirmChange() {
      this.$dialog.confirm({
        message:
          'Este processo é irreversível, tem certeza que já foram realizadas todas as alterações?',
        onConfirm: () => {
          const payload = {
            mailingList: this.mailingList,
            type: this.isAddition ? 'add' : 'remove',
            studentIds: this.filterIds('student'),
            solicitationIds: this.filterIds('solicitation')
          }
          this.$services.students
            .updateEmailChanges(payload)
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
