<template>
  <div class="container">
    <div class="container">
      <search-input
        :key="courseTag"
        :default-course="courseTag"
        :title="'Lista de Email - Ativos'"
        :is-active-email-list="1"
      ></search-input>
      <button
        v-if="hasEmailChanges"
        class="button is-primary"
        @click="activateModal"
      >
        Alterações pendentes
      </button>
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
      activate: false,
      hasEmailChanges: false
    }
  },

  computed: {
    ...mapState({
      courseTag: state => state.courseTag
    })
  },
  created() {
    // REQUEST TO GET POSSIBLE CHANGES
  },

  methods: {
    activateModal() {
      this.activate = !this.activate
    }
  }
}
</script>
