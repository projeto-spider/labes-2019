<template>
  <div class="container">
    <search-input
      :title="'Alunos totais'"
      :thead="head"
      :students="students"
    ></search-input>
  </div>
</template>

<script>
import SearchInput from '~/components/searchInput'
export default {
  name: 'AllStudents',
  components: {
    SearchInput
  },
  data() {
    return {
      head: ['Matrícula', 'Nome', 'Email'],
      students: {
        a: {
          registrationNumber: '201605498877',
          name: 'Gloria G. Delosreyes',
          email: 'GloriaGDelosreyes@armyspy.com'
        },
        b: {
          registrationNumber: '201605498877',
          name: 'Gloria G. Delosreyes',
          email: 'GloriaGDelosreyes@armyspy.com'
        },
        c: {
          registrationNumber: '201605498877',
          name: 'Gloria G. Delosreyes',
          email: 'GloriaGDelosreyes@armyspy.com'
        }
      } // teste
    }
  }
}
</script>

<style>
.container {
  height: 100vh;
}
</style>
