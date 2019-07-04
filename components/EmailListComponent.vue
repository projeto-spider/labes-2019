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
      class="button is-success"
      :disabled="!emailChanges.additions.length"
      @click="activateModal('additions')"
    >
      Estudantes a adicionar
      {{
        emailChanges.additions.length
          ? `(${emailChanges.additions.length})`
          : ''
      }}
    </button>
    <button
      v-if="hasEmailChanges"
      class="button is-danger"
      :disabled="!emailChanges.deletions.length"
      @click="activateModal('deletions')"
    >
      Estudantes a remover
      {{
        emailChanges.deletions.length
          ? `(${emailChanges.deletions.length})`
          : ''
      }}
    </button>
    <b-modal :active.sync="activate">
      <EmailCompare
        :students="putStudents"
        :is-addition="additionMode"
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
      additionMode: false,
      hasEmailChanges: false,
      emailChanges: {}
    }
  },

  computed: {
    ...mapState({
      courseTag: state => state.courseTag
    }),

    putStudents() {
      return this.additionMode
        ? this.emailChanges.additions
        : this.emailChanges.deletions
    }
  },
  created() {
    this.getChanges()
  },

  methods: {
    activateModal(mode) {
      this.activate = !this.activate
      this.additionMode = mode === 'additions'
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
        .catch(resError => {
          this.openErrorNotification(resError)
        })
    }
  }
}
</script>
