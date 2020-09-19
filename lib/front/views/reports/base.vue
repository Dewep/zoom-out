<template>
  <div id="reports-base">
    <ReportsSidebar id="reports-sidebar" />
    <div id="reports-container">
      <ReportsTopbar id="reports-topbar" />
      <ReportsContent id="reports-content" />
    </div>
  </div>
</template>

<script>
import ReportsSidebar from '@/views/reports/sidebar/main.vue'
import ReportsTopbar from '@/views/reports/topbar/main.vue'
import ReportsContent from '@/views/reports/content/main.vue'

export default {
  name: 'ReportBase',

  components: {
    ReportsSidebar,
    ReportsTopbar,
    ReportsContent
  }
}
</script>
