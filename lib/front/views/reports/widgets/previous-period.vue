<template>
  <div>
    <table class="table reports-widget-previous-period">
      <thead>
        <tr>
          <th />
          <th
            v-for="field in aggregatedFields"
            :key="'title-' + field.slug"
          >
            {{ field.name }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="period">
            <b v-if="from && to">{{ from }} - {{ to }}</b><br>
            <small
              v-if="previousPeriodFrom && previousPeriodTo"
              :data-tooltip="`${previousPeriodFrom} - ${previousPeriodTo}`"
              class="tooltip tooltip-bottom"
            >
              vs. précédente période
            </small>
          </td>
          <td
            v-for="field in aggregatedFields"
            :key="'value-' + field.slug"
          >
            {{ field.current }}<br>
            <small
              :data-tooltip="field.previous"
              :class="{ 'success-evolution': field.evolution > 0 }"
              class="tooltip"
            >
              {{ `${field.evolution > 0 ? '+' : ''}${field.evolution}%` }}
            </small>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { DateTime } from 'luxon'

export default {
  props: {
    report: {
      type: Object,
      required: true
    },
    filters: {
      type: Object,
      required: true
    },
    query: {
      type: String,
      required: true
    },
    fields: {
      type: Object,
      required: true
    },
    results: {
      type: Object,
      required: true
    }
  },

  computed: {
    aggregatedFields () {
      const aggregatedFields = {}
      for (const fieldSlug of Object.keys(this.fields)) {
        const field = this.fields[fieldSlug]
        const format = field.format || (v => v)
        const current = this.results.current[fieldSlug]
        const previous = this.results.previous[fieldSlug]
        const evolution = Math.round(((current - previous) / previous) * 10000) / 100
        aggregatedFields[fieldSlug] = {
          slug: fieldSlug,
          name: field.name,
          current: format(current),
          previous: format(previous),
          evolution
        }
      }
      return aggregatedFields
    },
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
