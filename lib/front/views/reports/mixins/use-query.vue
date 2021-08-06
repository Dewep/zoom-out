<script>
import encoder from '@/utils/encoder'

export default {
  name: 'use-query',

  props: {
    filters: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: () => ({})
    }
  },

  methods: {
    setOption (key, value) {
      this.setOptions({ ...this.options, [key]: value })
    },
    setOptions (options) {
      this.setQuery({ options, filters: this.filters })
    },
    setFilter (key, value) {
      this.setFilters({ ...this.filters, [key]: value })
    },
    setFilters (filters) {
      this.setQuery({ filters, options: this.options })
    },
    setQuery ({ filters, options }) {
      const query = encoder.encode({ filters, options })
      if (query !== this.$route.params.query) {
        this.$router.push({
          name: this.$router.currentRoute.name,
          params: { query }
        })
      }
    }
  }
}
</script>
