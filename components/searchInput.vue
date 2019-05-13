<template>
  <div>
    <br />
    <br />
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
          :striped="isStriped"
          :hoverable="isHoverabble"
          :data="filteredList"
          :selected.sync="selectedStudent"
          :columns="columns"
          focusable
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
import studentComboBox from '../components/studentComboBox'
export default {
  name: 'SearchInput',
  // props: ['title', 'students', 'thead'],
  components: {
    studentComboBox
  },
  props: {
    title: {
      type: String,
      default: () => "Page's title"
    },
    students: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      search: '',
      isStriped: true,
      isHoverabble: true,
      selectedStudent: null,
      columns: [
        {
          field: 'registrationNumber',
          label: 'Number'
        },
        {
          field: 'name',
          label: 'Name'
        },
        {
          field: 'email',
          label: 'Email'
        }
      ]
    }
  },
  computed: {
    filteredList() {
      return this.students.filter(student => {
        return (
          student.name.toLowerCase().includes(this.search.toLowerCase()) ||
          student.email.toLowerCase().includes(this.search.toLowerCase()) ||
          student.registrationNumber
            .toLowerCase()
            .includes(this.search.toLowerCase())
        )
      })
    }
  }
}
</script>
