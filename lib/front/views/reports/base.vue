<template>
  <div id="reports-base">
    <ReportsSidebar
      id="reports-sidebar"
      :report="report"
      :filters="filters"
      :options="options"
    />
    <div id="reports-container">
      <ReportsTopbar
        id="reports-topbar"
        :report="report"
        :filters="filters"
        :options="options"
      />

      <ReportsContent
        id="reports-content"
        :report="report"
        :filters="filters"
        :options="options"
      />
    </div>
  </div>
</template>

<script>
import ReportsSidebar from '@/views/reports/sidebar/main.vue'
import ReportsTopbar from '@/views/reports/topbar/main.vue'
import ReportsContent from '@/views/reports/content/main.vue'

export default {
  components: {
    ReportsSidebar,
    ReportsTopbar,
    ReportsContent
  },

  props: {
    report: {
      type: Object,
      default: null
    },
    filters: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      required: true
    }
  }
}
</script>
