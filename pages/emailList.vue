<template>
  <div class="container">
    <div class="container">
      <search-input
        :key="courseTag"
        :default-course="courseTag"
        :title="'Lista de Email - Ativos'"
        :is-active="1"
      ></search-input>
      <button class="button is-primary" @click="activateModal"></button>
      <b-modal :active.sync="activate">
        <email-compare></email-compare>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import EmailCompare from '../components/emailListCompare'
import SearchInput from '../components/searchInput'

export default {
  name: 'Email',
  middleware: ['auth', 'course'],
  components: {
    EmailCompare,
    SearchInput
  },
  data() {
    return {
      activate: false
    }
  },

  computed: {
    ...mapState({
      courseTag: state => state.courseTag
    })
  },

  methods: {
    activateModal() {
      this.activate = !this.activate
    }
  }
}
</script>
