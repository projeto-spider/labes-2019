<template>
  <EmailComponent
    :mailing-list="'concluding'"
    :title="'Lista de Email - Newsletter'"
  ></EmailComponent>
</template>

<script>
import EmailComponent from '@/components/EmailListComponent'
export default {
  name: 'EmailListActive',
  middleware: ['auth', 'course'],
  components: {
    EmailComponent
  },
  head() {
    return {
      title: 'Lista de email newsletter'
    }
  }
}
</script>

<style></style>
