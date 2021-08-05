<template>
  <div class="reports-widget-card">
    <CardHeader
      :title="title"
      :results="results"
    />

    <div :class="{ loading }" ref="card-body">
      <CardLoading
        v-if="!results"
        :loading="loading"
        :error="error"
        @reload="load()"
      />

      <template v-else>
        <slot
          :report="report"
          :filters="filters"
          :query="query"
          :results="results"
        />

        <ul v-if="paginated" class="pagination">
          <li class="page-item" :class="{ disabled: page === 1 }">
            <a @click="page -= 1">Previous</a>
          </li>
          <li v-if="page > 2" class="page-item" :class="{ disabled: page === 1 }">
            <a @click="page -= 2">{{ page - 2 }}</a>
          </li>
          <li v-if="page > 1" class="page-item">
            <a @click="page -= 1">{{ page - 1 }}</a>
          </li>
          <li class="page-item active">
            <a>{{ page }}</a>
          </li>
          <li v-if="page < nbPages" class="page-item">
            <a @click="page += 1">{{ page + 1 }}</a>
          </li>
          <li v-if="page < nbPages - 1" class="page-item">
            <a @click="page += 2">{{ page + 2 }}</a>
          </li>
          <li class="page-item" :class="{ disabled: page >= nbPages }">
            <a @click="page += 1">Next</a>
          </li>
        </ul>
      </template>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

import UseQuery from '@/views/reports/mixins/use-query.vue'

import CardHeader from '@/views/reports/widgets/card/header.vue'
import CardLoading from '@/views/reports/widgets/card/loading.vue'

export default {
  mixins: [UseQuery],

  components: {
    CardHeader,
    CardLoading
  },

  props: {
    report: {
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
    },
    paginated: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      loading: false,
      error: null,
      results: null
    }
  },

  computed: {
    nbPages () {
      return this.results ? this.results.nbPages : 1
    },
    page: {
      get () { return this.options && this.options.page || 1 },
      set (page) { this.setOption('page', page) }
    }
  },

  watch: {
    page: 'load',
    filters: {
      immediate: true,
      handler () {
        this.load()
      }
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
        const { filters, page, query, report } = this
        const data = { filters, query, report: report.slug }
        if (this.paginated) {
          data.page = page
        }

        this.results = await this.reportsQuery(data)

        if (this.paginated) {
          this.$refs['card-body'] && this.$refs['card-body'].scrollIntoView()
        }
      } catch (err) {
        this.error = err.message
      }
      this.loading = false
    }
  }
}
</script>

<style lang="scss" scoped>
.pagination {
  display: flex;
  flex-direction: row;
  justify-content: center;

  .page-item a {
    user-select: none;
    cursor: pointer;
  }
}
</style>
