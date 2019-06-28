<template>
  <div class="container">
    <div class="columns is-centered">
      <h1 class="title">
        <strong>Componente Curricular</strong>
      </h1>
    </div>

    <div class="columns is-centered" style="margin: 15px 0">
      <p>
        <b-button type="is-primary" @click="createSubject()">Novo</b-button>
      </p>
    </div>

    <b-table
      ref="table"
      :data="subjects"
      :columns="columns"
      paginated
      backend-sorting
      backend-pagination
      :total="total"
      :per-page="perPage"
      detailed
      :loading="loading"
      :current-page.sync="page"
      @page-change="onPageChange"
      @details-open="onDetailsOpen"
      @details-close="onDetailsClose"
    >
      <template slot="detail">
        <article v-if="editingSubject" class="media">
          <div class="media-content">
            <div class="content">
              <div class="columns">
                <div class="column">
                  <b-field
                    label="Componente Curricular"
                    :type="
                      editingSubjectDirty.name && !validName
                        ? 'is-danger'
                        : undefined
                    "
                    :message="
                      editingSubjectDirty.name && !validName
                        ? 'Campo não pode ficar vazio'
                        : undefined
                    "
                  >
                    <b-input
                      v-model="editingSubject.name"
                      @blur="editingSubjectDirty.name = true"
                    ></b-input>
                  </b-field>
                </div>
              </div>
              <b-button
                type="is-primary"
                :disabled="!validEditing"
                @click.prevent="updateSubject(editingSubject)"
                >Salvar</b-button
              >
              <template>
                <b-button type="is-danger" @click.prevent="confirmDeletion()">
                  Deletar
                </b-button>
              </template>
            </div>
          </div>
        </article>
      </template>
    </b-table>
  </div>
</template>

<script>
const defaultSubjectDirty = () => ({
  name: false
})

export default {
  name: 'Subjects',

  middleware: 'auth',
  head() {
    return {
      title: 'Labes - Componente curricular'
    }
  },
  data: () => ({
    loading: false,

    total: 0,
    totalPages: 0,
    page: 1,
    perPage: 10,

    lastDetailOpenId: null,

    subjects: [],

    columns: [
      {
        field: 'name',
        label: 'Componente Curricular'
      }
    ],

    editingSubjectDirty: defaultSubjectDirty(),
    editingSubject: null
  }),

  computed: {
    validEditing() {
      return this.validName
    },

    validName() {
      return this.editingSubject && this.editingSubject.name.length
    }
  },

  created() {
    this.loadSubjects()
  },

  methods: {
    loadSubjects() {
      this.loading = true

      this.$axios
        .get('/api/subjects/', {
          params: {
            page: this.page
          }
        })
        .then(res => {
          this.subjects = res.data
          this.total = +res.headers['pagination-row-count']
          this.totalPages = +res.headers['pagination-page-count']
          this.perPage = +res.headers['pagination-page-size']
        })
        .catch(() => {
          this.$toast.open({
            message: 'Falha ao carregar a lista de alunos.',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.loading = false
        })
    },

    onPageChange(page) {
      this.page = page
      this.lastDetailOpenId = null
      return this.loadSubjects()
    },

    createSubject() {
      this.$dialog.prompt({
        message: 'Qual o nome do componente curricular?',
        cancelText: 'Cancelar',
        confirmText: 'Criar',
        onConfirm: name => {
          this.loading = true
          const payload = { name }

          return this.$axios
            .$post('/api/subjects', payload)
            .then(subject => {
              this.page = Math.ceil((this.total + 1) / this.perPage)
              return this.loadSubjects()
            })
            .then(this.handleSaved)
            .catch(this.handleError)
            .finally(() => {
              this.loading = false
            })
        }
      })
    },

    updateSubject(subject) {
      this.loading = true
      return this.$axios
        .$put(`/api/subjects/${subject.id}`, subject)
        .then(subject => {
          const localSubject = this.subjects.find(
            localSubject => localSubject.id === subject.id
          )
          if (localSubject) {
            Object.assign(localSubject, subject)
          }
        })
        .then(this.handleSaved)
        .catch(this.handleError)
        .finally(() => {
          this.loading = false
        })
    },

    handleSaved() {
      this.$toast.open({
        message: 'Salvo com sucesso.',
        type: 'is-success'
      })
    },

    handleError(err) {
      if (err.response && err.response.status === 422) {
        return this.$toast.open({
          message: 'Nome já existe!',
          type: 'is-warning'
        })
      }

      this.$toast.open({
        message: 'Falha ao salvar',
        type: 'is-danger'
      })
    },

    confirmDeletion() {
      this.$dialog.confirm({
        title: 'Deletar componente curricular?',
        message: 'Isso não pode ser desfeito!',
        confirmText: 'Deletar',
        cancelText: 'Cancelar',
        type: 'is-danger',
        hasIcon: true,
        onConfirm: () => {
          this.$axios
            .$delete(`/api/subjects/${this.editingSubject.id}`)
            .then(() => {
              const index = this.subjects.findIndex(
                localSubject => localSubject.id === this.editingSubject.id
              )

              if (index !== -1) {
                this.subjects.splice(index, 1)
              }
              this.$toast.open('Deletado com sucesso!')
            })
            .catch(() => {
              this.$toast.open({
                message: 'Falha ao deletar',
                type: 'is-danger'
              })
            })
        }
      })
    },

    onDetailsOpen(row) {
      const lastOpenedRow = this.subjects.find(
        subject => subject.id === this.lastDetailOpenId
      )

      if (lastOpenedRow && lastOpenedRow !== row) {
        this.$refs.table.toggleDetails(lastOpenedRow)
      }

      this.lastDetailOpenId = row.id
      this.editingSubjectDirty = defaultSubjectDirty()
      this.editingSubject = { ...row }
    },

    onDetailsClose(row) {
      const lastOpenedRow = this.subjects.find(
        subject => subject.id === this.lastDetailOpenId
      )

      if (lastOpenedRow && lastOpenedRow === row) {
        this.lastDetailOpenId = null
      }
    }
  }
}
</script>

<style scoped>
.container {
  margin: 50px auto 50px auto;
  max-width: 90%;
}
</style>
