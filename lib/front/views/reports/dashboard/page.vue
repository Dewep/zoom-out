<template>
  <div class="about">
    <h1>Dashboard</h1>

    <component
      :is="componentName"
      v-for="componentName in componentNames"
      :key="componentName"
    />
  </div>
</template>

<script>
import reports from '@/reports/vue'

export default {
  name: 'ReportDashboardPage',

  components: {
    ...reports.dashboard.components
  },

  computed: {
    componentNames () {
      return reports.dashboard.names
    }
  }
}
</script>
