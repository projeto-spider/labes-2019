<template>
  <div class="container">
    <admission :mailing-list="'concluding'"></admission>
  </div>
</template>

<script>
import admission from '~/components/admission'

export default {
  name: 'ConcludingAdmission',
  layout: 'admissionLayout',
  components: {
    admission
  }
}
</script>
