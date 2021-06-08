<template>
  <div>
    <div
      v-for="(items, sectionKey) in sections"
      :key="sectionKey"
    >
      <h2
        v-if="sectionKey !== '_default'"
        class="section-title"
      >
        {{ sectionKey }}
      </h2>

      <RouterLink
        v-for="item in items"
        :key="item.slug"
        :to="{ name: `report-${item.slug}` }"
        class="reports-nav-item"
      >
        {{ item.name }}
      </RouterLink>
    </div>
  </div>
</template>

<script>
import reports from '@/reports'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters([
      'reportsAuthFilters'
    ]),
    sections () {
      const sections = {
        _default: []
      }

      for (const report of reports) {
        if (report.page === null) {
          continue
        }

        if (this.reportsAuthFilters && !this.reportsAuthFilters.includes(report.slug)) {
          continue
        }

        if (report.section && !sections[report.section]) {
          sections[report.section] = []
        }
        sections[report.section || '_default'].push({ slug: report.slug, name: report.name })
      }

      if (!sections._default.length) {
        delete sections._default
      }

      return sections
    }
  }
}
</script>
