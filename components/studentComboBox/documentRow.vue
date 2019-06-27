<template>
  <tr v-show="hideWhenCantEdit ? !(!hasDocument && disable) : true">
    <td class="vertical-align-middle is-paddingless-y" style="min-width: 110px">
      <strong>{{ title }}</strong>
    </td>

    <td class="vertical-align-middle is-paddingless-y">
      <b-checkbox
        v-model="check"
        :disabled="disable"
        @input="onCheckInput"
      ></b-checkbox>
    </td>

    <td class="has-text-centered vertical-align-middle is-paddingless-y">
      <a
        v-if="hasDocument"
        :href="`${value.url}?token=${token}`"
        target="_blank"
      >
        <b-icon icon="file-pdf" class="is-inline-block"></b-icon>
      </a>
      <span v-else class="has-text-grey">Sem documento</span>
    </td>

    <td
      class="has-text-centered vertical-align-middle is-paddingless-y"
      style="min-width: 100px"
    >
      <b-upload v-model="file" :disabled="!canUpload" @input="validateUpload">
        <a
          class="button is-success"
          :class="{ 'is-outlined': !canUpload }"
          :disabled="!canUpload"
        >
          <b-icon icon="upload"></b-icon>
        </a>
      </b-upload>

      <b-button
        v-if="hasDocument"
        class="button is-danger"
        :class="{ 'is-outlined': !canUpload }"
        :disabled="!canUpload"
        @click="onClickDelete"
      >
        <b-icon icon="trash"></b-icon>
      </b-button>
    </td>
  </tr>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DocumentRow',

  props: {
    value: {
      type: [Object, Boolean],
      default: false
    },

    title: {
      type: String,
      default: ''
    },

    check: {
      type: Boolean
    },

    disable: {
      type: Boolean
    },

    hideWhenCantEdit: {
      type: Boolean,
      default: false
    }
  },

  data: () => ({
    file: File
  }),

  computed: {
    ...mapState({
      token: state => state.auth.token
    }),

    hasDocument() {
      const document = this.value

      return !(
        Object.entries(document).length === 0 &&
        typeof document === 'object' &&
        document !== null
      )
    },

    canUpload() {
      return this.check && !this.disable
    }
  },

  methods: {
    validateUpload(file) {
      if (!this.file) {
        return
      }

      if (this.file.size >= process.env.config.MAX_FILE_SIZE) {
        this.openErrorNotification(process.env.errors.MAX_FILE_SIZE_EXCEEDED)
        this.file = new File([''], 'Nenhum arquivo selecionado')
        this.hasErrors = true
        return
      }

      const isPDF = this.file.name.split('.').pop() === 'pdf'

      if (isPDF) {
        return this.$emit('update:file', file)
      }

      this.$toast.open({
        message: 'Por favor selecione um arquivo PDF',
        type: 'is-danger'
      })

      this.file = File
    },

    onCheckInput(value) {
      this.$emit('update:check', value)
    },

    onClickDelete() {
      this.$emit('delete', this.value)
    }
  }
}
</script>

<style scoped>
.vertical-align-middle {
  vertical-align: middle;
}

/* Fix vertical centralization */
.is-paddingless-y {
  padding-top: 0;
  padding-bottom: 0;
}
</style>
