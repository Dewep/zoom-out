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

export default {
  computed: {
    sections () {
      const sections = {
        _default: []
      }

      for (const report of reports) {
        if (report.page === null) {
          continue
        }

        if (report.section && !sections[report.section]) {
          sections[report.section] = []
        }
        sections[report.section || '_default'].push({ slug: report.slug, name: report.name })
      }

      if (!sections._default.length) {
        delete sections._default.length
      }

      return sections
    }
  }
}
</script>
