<template>
  <div class="about">
    <component
      :is="componentName"
      v-for="componentName in componentNames"
      :key="componentName"
    />
  </div>
</template>

<script>
import reports from '@/reports/vue'
import { mapGetters } from 'vuex'

export default {
  name: 'ReportDashboardPage',

  components: {
    ...reports.dashboard.components
  },

  computed: {
    ...mapGetters([
      'reportsAuthFilters'
    ]),
    componentNames () {
      return reports.dashboard.names.filter(reportSlug => !this.reportsAuthFilters || this.reportsAuthFilters.includes(reportSlug))
    }
  }
}
</script>
