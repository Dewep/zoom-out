<template>
  <div class="reports-widget-card">
    <CardHeader
      :title="title"
      :results="results"
    />

    <div :class="{ loading }">
      <CardLoading
        v-if="!results"
        :loading="loading"
        :error="error"
        @reload="load()"
      />

      <slot
        v-else
        :report="report"
        :filters="filters"
        :query="query"
        :results="results"
      />
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import CardHeader from '@/views/reports/widgets/card/header.vue'
import CardLoading from '@/views/reports/widgets/card/loading.vue'

export default {
  components: {
    CardHeader,
    CardLoading
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
    title: {
      type: String,
      required: true
    }
  },

  data () {
    return {
      loading: false,
      error: null,
      results: null
    }
  },

  watch: {
    filters: {
      handler () {
        this.load()
      },
      immediate: true
    }
  },

  methods: {
    ...mapActions([
      'reportsQuery'
    ]),

    async load () {
      if (this.loading) {
        return
      }
      this.loading = true
      this.error = null
      try {
        this.results = await this.reportsQuery({ report: this.report.slug, query: this.query, filters: this.filters })
      } catch (err) {
        this.error = err.message
      }
      this.loading = false
    }
  }
}
</script>
