<template>
  <div class="columns">
    <ConferenceHistory
      :report="report"
      :filters="filters"
      class="column col-12"
    />
    <ConferenceStats
      :report="report"
      :filters="filters"
      class="column col-12"
    />
  </div>
</template>

<script>
import ConferenceHistory from './history.vue'
import ConferenceStats from './stats.vue'

export default {
  components: {
    ConferenceHistory,
    ConferenceStats
  },

  props: {
    report: {
      type: Object,
      required: true
    },
    filters: {
      type: Object,
      required: true
    }
  }
}
</script>
