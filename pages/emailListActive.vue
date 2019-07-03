<template>
  <EmailComponent
    :mailing-list="'active'"
    title="Lista de Email - Ativos"
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
      title: 'Lista de email ativos'
    }
  }
}
</script>

<style></style>
