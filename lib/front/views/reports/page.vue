<template>
  <div id="reports-app">
    <ReportsGeneralLoader
      v-if="!true"
    />
    <ReportsBase
      v-else
    />
  </div>
</template>

<script>
import ReportsGeneralLoader from '@/views/reports/general-loader.vue'
import ReportsBase from '@/views/reports/base.vue'

export default {
  name: 'ReportsPage',

  components: {
    ReportsGeneralLoader,
    ReportsBase
  }
}
</script>
