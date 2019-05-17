<template>
  <div class="container">
    <div class="columns is-centered">
      <h1 class="title">
        <strong>{{ title }}</strong>
      </h1>
    </div>
    <br />
    <div class="columns is-centered">
      <div class="column is-half">
        <div class="control has-icons-left">
          <b-input
            v-model="search"
            placeholder="Buscar aluno"
            type="search"
            icon="search"
            rounded
          ></b-input>
        </div>
        <br />
        <b-table
          v-if="filteredList.length > 0"
          :striped="isStriped"
          :hoverable="isHoverable"
          :data="filteredList"
          :loading="loading"
          :selected.sync="selectedStudent"
          :columns="columns"
          focusable
          paginated
          backend-pagination
          :total="total"
          :per-page="perPage"
          backend-sorting
          :default-sort-direction="sortOrder"
          :default-sort="[sortField, sortOrder]"
          @page-change="onPageChange"
          @sort="onSort"
        ></b-table>
        <b-modal :active.sync="selectedStudent" has-modal-card>
          <student-combo-box
            v-if="selectedStudent"
            :student="selectedStudent"
          ></student-combo-box>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script>
import pDebounce from 'p-debounce'
import studentComboBox from '../components/studentComboBox'
export default {
  name: 'SearchInput',
  components: {
    studentComboBox
  },
  props: {
    title: {
      type: String,
      default: () => "Page's title"
    },
    defaultCourse: {
      type: String,
      default: () => 'cbcc'
    },
    isActive: {
      type: Number,
      default: () => 0
    },
    defaultSortField: {
      type: String,
      default: () => 'name'
    },
    defaultSortOrder: {
      type: String,
      default: () => 'asc'
    },
    defaultPage: {
      type: Number,
      default: () => 1
    },
    defaultPerPage: {
      type: Number,
      default: () => 10
    }
  },
  data() {
    return {
      search: '',
      isStriped: true,
      isHoverable: true,
      selectedStudent: null,
      columns: [
        {
          field: 'registrationNumber',
          label: 'Matrícula',
          sortable: true
        },
        {
          field: 'name',
          label: 'Nome',
          sortable: true
        },
        {
          field: 'email',
          label: 'Email'
        }
      ],
      total: 0,
      page: 1,
      perPage: this.defaultPerPage,
      sortField: this.defaultSortField,
      sortOrder: this.defaultSortOrder,
      course: this.defaultCourse,
      loading: false,
      students: []
    }
  },

  computed: {
    filteredList() {
      return this.students.filter(student => {
        return (
          student.name.toLowerCase().includes(this.search.toLowerCase()) ||
          // student.email.toLowerCase().includes(this.search.toLowerCase()) ||
          student.registrationNumber
            .toLowerCase()
            .includes(this.search.toLowerCase())
        )
      })
    }
  },

  watch: {
    filteredList: function() {
      if (this.filteredList.length < this.students.length) {
        this.total = this.filteredList.length
      }
      if (this.filteredList.length < 1 && this.students.length > 0) {
        this.$toast.open({
          message: `Não há alunos que correspondam a chave de pesquisa ${
            this.search
          }`,
          type: 'is-danger'
        })
      }
    }
  },

  afterMounted() {
    if (this.students.length < 1 && this.defaultFilters.isActive === 1) {
      this.$toast.open({
        message: 'Não há alunos ativos neste curso',
        type: 'is-danger'
      })
    }
  },

  created() {
    this.getStudents()
  },

  methods: {
    getStudentsFilters: pDebounce(function getStudentsFilters() {
      this.getStudents()
    }, 500),

    getStudents() {
      this.loading = true
      this.$axios
        .get('/api/students/', {
          params: {
            course: this.course,
            isActive: this.isActive,
            page: this.page,
            sort: this.sortField,
            order: this.sortOrder
          }
        })
        .then(res => {
          this.students = res.data
          const factor =
            this.filteredList.length < this.students.length
              ? this.filteredList.length
              : res.headers['pagination-page-count'] * this.perPage
          this.total = factor
          this.loading = false
        })
        .catch(() => {
          this.$toast.open({
            message: 'Falha ao carregar a lista de alunos.',
            type: 'is-danger'
          })
        })
    },

    onSort(filterField, order) {
      this.sortField = filterField
      this.sortOrder = order
      this.getStudents()
    },

    onPageChange(page) {
      this.page = page
      this.getStudents()
    }
  }
}
</script>

<style scoped>
template {
  overflow-y: hidden;
}

.container {
  margin: 50px auto 50px auto;
}
</style>
