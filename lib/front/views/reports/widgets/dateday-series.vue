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
            <center><small>{{ selectedDot.labelLong }}</small></center>
            <b>Total {{ selectedDot.valueSum }}</b><br>
            <div class="reports-legends">
              <div
                v-for="(label, index) in fields.labels"
                :key="index"
                class="reports-legends-item"
              >
                <span
                  :style="{ background: `rgb(${colors[index].join(',')})` }"
                  class="reports-legends-item-color"
                />
                <b>{{ selectedDot.value[index] }}</b> {{ label }}
              </div>
            </div>
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
        <template>{{ label }}</template>
      </div>
    </div>
  </div>
</template>

<script>
import { base } from '@/utils/colors'
import ReportsWidgetChartArea from '@/views/reports/widgets/charts/base/area.vue'
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
      default: () => base
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
