<template>
  <div id="reports-base">
    <div id="reports-sidebar">
      <ReportsSidebar />
    </div>
    <div id="reports-container">
      <div id="reports-topbar">
        <ReportsTopbar />
      </div>
      <div id="reports-content">
        <ReportsContent />
      </div>
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
