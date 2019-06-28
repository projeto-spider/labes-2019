<template>
  <EmailComponent
    :mailing-list="'freshman'"
    :title="'Lista de Email - Calouros'"
  ></EmailComponent>
</template>

<script>
import EmailComponent from '@/components/EmailListComponent'
export default {
  name: 'EmailListActive',
  middleware: ['auth', 'course'],
  components: {
    EmailComponent
  }
}
</script>

<style></style>
