<template>
  <email-component
    :mailing-list="'concluding'"
    :title="'Lista de Email - Newsletter'"
  ></email-component>
</template>

<script>
import EmailComponent from '../components/emailListComponent'
export default {
  name: 'EmailListActive',
  middleware: ['auth', 'course'],
  components: {
    EmailComponent
  }
}
</script>

<style></style>
