<template>
  <div class="container">
    <admissionForm :mailing-list="'freshman'"></admissionForm>
  </div>
</template>

<script>
import admissionForm from '~/components/AdmissionForm'

export default {
  name: 'FreshmenAdmission',
  layout: 'admissionLayout',
  components: {
    admissionForm
  }
}
</script>
