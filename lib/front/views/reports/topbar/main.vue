<template>
  <div>
    <TopbarTitle
      id="reports-topbar-title"
      :report="report"
      :filters="filters"
    />

    <TopbarGlobalFilters
      id="reports-topbar-global-filters"
      :report="report"
      :filters="filters"
    />
  </div>
</template>

<script>
import TopbarTitle from '@/views/reports/topbar/title.vue'
import TopbarGlobalFilters from '@/views/reports/topbar/global-filters.vue'

export default {
  components: {
    TopbarTitle,
    TopbarGlobalFilters
  },

  props: {
    report: {
      type: Object,
      default: null
    },
    filters: {
      type: Object,
      required: true
    }
  }
}
</script>
