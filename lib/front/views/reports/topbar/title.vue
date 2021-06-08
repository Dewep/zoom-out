<template>
  <div>
    <h1>{{ title }}</h1>
  </div>
</template>

<script>
export default {
  props: {
    report: {
      type: Object,
      default: null
    },
    filters: {
      type: Object,
      required: true
    }
  },

  computed: {
    title () {
      if (this.report) {
        return this.report.name || this.report.slug || 'N/A'
      }
      return 'Dashboard'
    }
  }
}
</script>
