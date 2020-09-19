<template>
  <div>
    <GlobalFiltersDate
      :report="report"
      :filters="filters"
    />
  </div>
</template>

<script>
import GlobalFiltersDate from '@/views/reports/topbar/global-filters-date.vue'

export default {
  components: {
    GlobalFiltersDate
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
