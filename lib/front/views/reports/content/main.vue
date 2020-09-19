<template>
  <div>
    <ContentFilters />

    <ContentPage />

    <ContentFooter />
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
  }
}
</script>
