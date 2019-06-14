<template>
  <div class="container">
    <div class="container">
      <search-input
        :key="courseTag"
        :default-course="courseTag"
        :title="'Lista de Email - Ativos'"
        :mailing-list="'active'"
        :is-active="'AllStudents'"
      ></search-input>
      <button
        v-if="hasEmailChanges"
        class="button is-primary"
        @click="activateModal"
      >
        Alterações pendentes
      </button>
      <b-modal :active.sync="activate">
        <email-compare
          :students-to-add="emailChanges.additions"
          :students-to-remove="emailChanges.deletions"
          :mailing-list="'active'"
          @email-list-changed="getChanges"
        ></email-compare>
      </b-modal>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import EmailCompare from '../components/emailListCompare'
import SearchInput from '../components/searchInput'
import { errorsHandler } from '../components/mixins/errors'

export default {
  name: 'Email',
  middleware: ['auth', 'course'],
  components: {
    EmailCompare,
    SearchInput
  },
  mixins: [errorsHandler],
  data() {
    return {
      activate: false,
      hasEmailChanges: false,
      emailChanges: {}
    }
  },

  computed: {
    ...mapState({
      courseTag: state => state.courseTag
    })
  },
  created() {
    this.getChanges()
  },

  methods: {
    activateModal() {
      this.activate = !this.activate
    },
    getChanges() {
      this.$axios
        .get('/api/students/email-changes', {
          params: {
            mailingList: 'active'
          }
        })
        .then(res => {
          if (
            res.data.additions.length !== 0 ||
            res.data.deletions.length !== 0
          ) {
            this.emailChanges = res.data
            this.hasEmailChanges = true
          } else {
            this.emailChanges = []
            this.hasEmailChanges = false
          }
        })
        .catch(resErro => {
          this.openErrorNotification(resErro)
        })
    }
  }
}
</script>
