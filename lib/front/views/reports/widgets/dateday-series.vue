<template>
  <div>
    <div class="reports-widget-dateday-series">
      <ReportsWidgetChartArea
        :values="areaValues"
        :default-min-y="0"
      >
        <template v-slot:default="{ selectedDot }">
          <slot :selectedDot="selectedDot">
            <b>{{ selectedDot.value }}</b><br>
            <b>{{ selectedDot.labelLong }}</b>
          </slot>
        </template>
      </ReportsWidgetChartArea>
    </div>
  </div>
</template>

<script>
import ReportsWidgetChartArea from '@/views/reports/widgets/charts/area.vue'
import { DateTime } from 'luxon'

export default {
  components: {
    ReportsWidgetChartArea
  },

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
    areaValues () {
      const values = this.results.series.map(item => {
        return {
          value: item[this.fields.valueSlug],
          label: DateTime.fromISO(item.date).toLocaleString({ month: 'short', day: 'numeric' }),
          labelLong: DateTime.fromISO(item.date).toLocaleString({ year: 'numeric', month: 'long', day: 'numeric' })
        }
      })
      return values
    }
  }
}
</script>
