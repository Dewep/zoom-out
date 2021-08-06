<template>
  <div id="reports-content-page">
    <RouterView
      :report="report"
      :filters="filters"
      :options="options"
    />
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
    },
    options: {
      type: Object,
      required: true
    }
  }
}
</script>
