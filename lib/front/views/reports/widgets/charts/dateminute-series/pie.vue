<template>
  <div class="reports-widget-dateminute-series">
    <ChartPie :values="values"/>
  </div>
</template>

<script>
import { base } from '@/utils/colors'
import ChartPie from '../base/pie';

export default {
  components: {
    ChartPie
  },

  props: {
    results: {
      type: Object,
      required: true
    },
    labels: {
      type: Object,
      default: () => {}
    },
    colors: {
      type: [Array, Object],
      default: () => base
    }
  },

  computed: {
    values () {
      return Object.entries(this.results.series.reduce((acc, obj) => {
        for (const [key, value] of Object.entries(obj)) {
          if (key.startsWith('date')) {
            continue
          }
          acc[key] = (acc[key] || 0) + value
        }
        return acc
      }, {}))
      .map(([key, value]) => ({ label: this.labels[key] || key, value, color: this.colors[key] || null }))
    }
  }
}
</script>
