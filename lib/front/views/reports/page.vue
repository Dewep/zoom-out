<template>
  <div id="reports-app">
    <ReportsGeneralLoader
      v-if="(!report && reportQuery !== 'dashboard') || !filters"
    />
    <ReportsBase
      v-else
      :report="report"
      :filters="filters"
      :options="options"
    />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

import reports from '@/reports'
import encoder from '@/utils/encoder'
import ReportsGeneralLoader from '@/views/reports/general-loader.vue'
import ReportsBase from '@/views/reports/base.vue'

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
    query: {
      type: String,
      default: null
    }
  },

  computed: {
    ...mapGetters([
      'reportsAuthFilters'
    ]),
    report () {
      const report = reports.find(report => report.slug === this.reportQuery)
      if (report && this.reportsAuthFilters && !this.reportsAuthFilters.includes(this.reportQuery)) {
        return null
      }
      return report || null
    },
    decodedQuery () {
      try {
        const { filters = {}, options = {} } = encoder.decode(this.query)
        return { filters, options }
      } catch {
        return { filters: {}, options: {} }
      }
    },
    filters () {
      const filters = this.decodedQuery.filters

      if (!filters.date) {
        filters.date = ['last-30-days']
      }

      return filters
    },
    options () {
      return this.decodedQuery.options
    }
  },

  watch: {
    report: {
      handler () {
        if (!this.report && this.reportQuery !== 'dashboard') {
          this.$router.replace({ name: 'report-dashboard', params: { query: this.query } })
        }
      },
      immediate: true
    },
    filters: {
      immediate: true,
      handler () {
        if (!this.filters) {
          this.$router.replace({ name: this.$router.currentRoute.name })
        }
      }
    }
  }
}
</script>
