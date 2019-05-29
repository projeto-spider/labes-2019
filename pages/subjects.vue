<template>
  <div class="container">
    <div class="columns is-centered">
      <h1 class="title">
        <strong>Componente Curricular</strong>
      </h1>
    </div>

    <div class="columns is-centered" style="margin: 15px 0">
      <p>
        <b-button type="is-primary" @click="openFakeSubject()">Novo</b-button>
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
      :per-page="fakeSubject ? perPage + 1 : perPage"
      detailed
      detail-key="id"
      :loading="loading"
      :current-page.sync="page"
      @page-change="onPageChange"
      @details-open="onDetailsOpen"
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
                @click.prevent="onSaveEditingSubject()"
                >Salvar</b-button
              >
              <template>
                <b-button
                  v-if="Number.isFinite(editingSubject.id)"
                  type="is-danger"
                  @click.prevent="confirmDeletion()"
                >
                  Deletar
                </b-button>
                <b-button
                  v-else
                  type="is-danger"
                  @click.prevent="deleteFakeSubject()"
                >
                  Cancelar
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
    },

    fakeSubject() {
      return this.subjects.find(subject => !Number.isFinite(subject.id))
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
      this.loadSubjects()
    },

    openFakeSubject() {
      if (this.fakeSubject) {
        this.deleteFakeSubject()
      }

      const id = Symbol('newSubject')
      const row = {
        id,
        name: ''
      }
      this.subjects.unshift(row)

      this.$refs.table.toggleDetails(row)
      this.onDetailsOpen(row)
    },

    onSaveEditingSubject() {
      const { editingSubject } = this

      const operation = !Number.isFinite(editingSubject.id)
        ? this.createSubject
        : this.updateSubject

      this.loading = true

      operation(editingSubject)
        .then(() => {
          this.$toast.open({
            message: 'Salvo com sucesso.',
            type: 'is-success'
          })
        })
        .catch(() => {
          this.$toast.open({
            message: 'Falha ao salvar',
            type: 'is-danger'
          })
        })
        .finally(() => {
          this.loading = false
        })
    },

    createSubject(subject) {
      const payload = { ...subject }
      payload.id = undefined

      return this.$axios.$post('/api/subjects', subject).then(subject => {
        this.page = Math.ceil((this.total + 1) / this.perPage)
        return this.loadSubjects()
      })
    },

    updateSubject(subject) {
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
          const index = this.subjects.findIndex(
            localSubject => localSubject.id === this.editingSubject.id
          )

          if (index !== -1) {
            this.subjects.splice(index, 1)
          }

          this.$toast.open('Deletado com sucesso!')
        }
      })
    },

    deleteFakeSubject() {
      const index = this.subjects.indexOf(this.fakeSubject)

      if (index === -1) {
        return
      }
      if (this.lastDetailOpenId === this.fakeSubject.id) {
        this.$refs.table.toggleDetails(this.fakeSubject)
      }
      this.subjects.splice(index, 1)
      this.lastDetailOpenId = null
    },

    onDetailsOpen(row) {
      if (this.fakeSubject && row.id !== this.fakeSubject.id) {
        this.deleteFakeSubject()
      }

      const lastOpenedRow = this.subjects.find(
        subject => subject.id === this.lastDetailOpenId
      )

      if (lastOpenedRow && lastOpenedRow !== row) {
        this.$refs.table.toggleDetails(lastOpenedRow)
      }

      this.lastDetailOpenId = row.id
      this.editingSubjectDirty = defaultSubjectDirty()
      this.editingSubject = { ...row }
    }
  }
}
</script>

<style scoped>
.container {
  margin: 50px auto 50px auto;
}
</style>
