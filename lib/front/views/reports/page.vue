<template>
  <div id="reports-app">
    <ReportsGeneralLoader
      v-if="!filters"
    />
    <ReportsBase
      v-else
      :report="report"
      :filters="filters"
    />
  </div>
</template>

<script>
import reports from '@/reports'
import encoder from '@/utils/encoder'
import ReportsGeneralLoader from '@/views/reports/general-loader.vue'
import ReportsBase from '@/views/reports/base.vue'

const defaultFiltersQuery = encoder.encode({ date: ['last-30-days'] })

export default {
  components: {
    ReportsGeneralLoader,
    ReportsBase
  },

  props: {
    reportQuery: {
      type: String,
      default: null
    },
    filtersQuery: {
      type: String,
      default: null
    }
  },

  computed: {
    report () {
      const report = reports.find(report => report.slug === this.reportQuery)
      return report || null
    },
    filters () {
      let filters = {}
      try {
        if (this.filtersQuery) {
          filters = encoder.decode(this.filtersQuery)
        }
      } catch (err) {
        console.warn(err)
        return null
      }
      if (!filters.date) {
        filters.date = ['last-30-days']
      }
      if (this.filtersQuery && encoder.encode(filters) === defaultFiltersQuery) {
        return null
      }
      return filters
    }
  },

  watch: {
    report: {
      handler () {
        if (!this.report && this.reportQuery !== 'dashboard') {
          this.$router.replace({ name: 'report-dashboard', params: { filtersQuery: this.filtersQuery } })
        }
      },
      immediate: true
    },
    filters: {
      handler () {
        if (!this.filters) {
          this.$router.replace({ name: this.$router.currentRoute.name })
        }
      },
      immediate: true
    }
  }
}
</script>
