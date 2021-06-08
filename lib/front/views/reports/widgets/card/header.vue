<template>
  <h2>
    {{ title }}
    <template v-if="from && to">
      <br>
      <small>
        {{ from }} - {{ to }}
        <template v-if="previousPeriodFrom && previousPeriodTo">
          (vs. {{ previousPeriodFrom }} - {{ previousPeriodTo }})
        </template>
      </small>
    </template>
  </h2>
</template>

<script>
import { DateTime } from 'luxon'

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    results: {
      type: Object,
      default: null
    }
  },

  computed: {
    from () {
      if (!this.results || !this.results.from) {
        return null
      }
      return DateTime.fromISO(this.results.from).toLocaleString({ month: 'short', day: 'numeric' })
    },
    to () {
      if (!this.results || !this.results.to) {
        return null
      }
      return DateTime.fromISO(this.results.to).toLocaleString({ month: 'short', day: 'numeric' })
    },
    previousPeriodFrom () {
      if (!this.results || !this.results.from || !this.results.previousPeriodFrom) {
        return null
      }
      return DateTime.fromISO(this.results.previousPeriodFrom).toLocaleString({ month: 'short', day: 'numeric' })
    },
    previousPeriodTo () {
      if (!this.results || !this.results.from || !this.results.previousPeriodFrom) {
        return null
      }
      return DateTime.fromISO(this.results.from).minus({ days: 1 }).toLocaleString({ month: 'short', day: 'numeric' })
    }
  }
}
</script>
