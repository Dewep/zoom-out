<template>
  <div>
    <ContentFilters
      v-if="report"
      :report="report"
      :filters="filters"
    />

    <ContentPage
      :report="report"
      :filters="filters"
    />

    <ContentFooter
      :report="report"
      :filters="filters"
    />
  </div>
</template>

<script>
import ContentFilters from '@/views/reports/content/filters.vue'
import ContentPage from '@/views/reports/content/page.vue'
import ContentFooter from '@/views/reports/content/footer.vue'

export default {
  components: {
    ContentFilters,
    ContentPage,
    ContentFooter
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
