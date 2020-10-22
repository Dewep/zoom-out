<template>
  <div>
    <div class="reports-widget-dateday-series">
      <ReportsWidgetChartArea
        :values="areaValues"
        :default-min-y="0"
        :colors="colors"
      >
        <template v-slot:default="{ selectedDot }">
          <slot :selectedDot="selectedDot">
            <b>{{ selectedDot.valueSum }}</b><br>
            <b>{{ selectedDot.labelLong }}</b>
          </slot>
        </template>
      </ReportsWidgetChartArea>
    </div>

    <div class="reports-legends">
      <div
        v-for="(label, index) of fields.labels"
        :key="index"
        class="reports-legends-item"
      >
        <span
          :style="{ background: `rgb(${colors[index].join(',')})` }"
          class="reports-legends-item-color"
        />
        {{ label }}
      </div>
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
    },
    colors: {
      type: Array,
      default: () => [
        [[25, 103, 210]],
        [[210, 76, 25]],
        [[164, 25, 210]],
        [[210, 25, 93]]
      ]
    }
  },

  computed: {
    areaValues () {
      const values = this.results.series.map(item => {
        const value = this.fields.compute ? this.fields.compute(item) : item[this.fields.valueSlug]
        return {
          ...item,
          value,
          label: DateTime.fromISO(item.date).toLocaleString({ month: 'short', day: 'numeric' }),
          labelLong: DateTime.fromISO(item.date).toLocaleString({ year: 'numeric', month: 'long', day: 'numeric' })
        }
      })
      return values
    }
  }
}
</script>
