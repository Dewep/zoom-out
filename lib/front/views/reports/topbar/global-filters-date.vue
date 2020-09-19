<template>
  <a class="btn btn-primary">
    <i class="fa-calendar-alt fas mr-2" />
    30 derniers jours
    <i class="fa-angle-down fas ml-2" />
  </a>
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
  }
}
</script>
