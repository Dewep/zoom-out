<template>
  <div>
    <TopbarTitle id="reports-topbar-title" />

    <TopbarGlobalFilters id="reports-topbar-global-filters" />
  </div>
</template>

<script>
import TopbarTitle from '@/views/reports/topbar/title.vue'
import TopbarGlobalFilters from '@/views/reports/topbar/global-filters.vue'

export default {
  components: {
    TopbarTitle,
    TopbarGlobalFilters
  }
}
</script>
