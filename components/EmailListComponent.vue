<template>
  <div class="container">
    <SearchInput
      :key="courseTag"
      :default-course="courseTag"
      :title="title"
      :mailing-list="mailingList"
    ></SearchInput>
    <button
      v-if="hasEmailChanges"
      class="button is-primary"
      @click="activateModal"
    >
      Alterações pendentes
    </button>
    <b-modal :active.sync="activate">
      <EmailCompare
        :students-to-add="emailChanges.additions"
        :students-to-remove="emailChanges.deletions"
        :mailing-list="mailingList"
        @email-list-changed="getChanges"
      ></EmailCompare>
    </b-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import EmailCompare from '@/components/EmailListCompare'
import SearchInput from '@/components/SearchInput'
import { errorsHandler } from '@/components/mixins/errors'

export default {
  name: 'EmailComponent',
  components: {
    EmailCompare,
    SearchInput
  },
  mixins: [errorsHandler],
  props: {
    mailingList: {
      type: String,
      default: () => ''
    },
    title: {
      type: String,
      default: () => ''
    }
  },
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
      this.$services.students
        .fetchEmailChanges(this.mailingList)
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
