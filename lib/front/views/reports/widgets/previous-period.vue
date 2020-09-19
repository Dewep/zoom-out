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
            <b>20 août - 19 sept</b><br>
            <small>vs. précédente période</small>
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
        console.log(fieldSlug, this.results)
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
    }
  }
}
</script>
