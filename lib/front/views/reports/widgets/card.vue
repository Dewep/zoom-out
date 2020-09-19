<template>
  <div class="reports-widget-card">
    <h2>{{ title }}</h2>

    <div :class="{ loading }">
      <div
        v-if="!results"
        class="reports-widget-card-waiting"
      >
        <span
          v-if="error"
          class="label label-error pointer"
          @click.prevent="load"
        >
          {{ error }}
        </span>
        <span v-else>
          Chargement
        </span>
      </div>

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
