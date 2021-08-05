<template>
  <div />
</template>

<script>
import encoder from '@/utils/encoder'

export default {
  name: 'filters-set',

  props: {
    filters: {
      type: Object,
      required: true
    }
  },

  methods: {
    setFilter (key, value) {
      this.setFilters({ ...this.filters, [key]: value })
    },
    setFilters (filters) {
      const filtersQuery = encoder.encode(filters)
      if (filtersQuery !== this.$route.params.filtersQuery) {
        this.$router.push({
          name: this.$router.currentRoute.name,
          params: { filtersQuery }
        })
      }
    }
  }
}
</script>

<style scoped>

</style>
