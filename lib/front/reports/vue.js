import reports from '@/reports'

const dashboard = {
  components: {},
  names: []
}

const list = reports.map(report => {
  const item = {
    slug: report.slug,
    page: report.page !== null ? require(`@/reports/${report.slug}/${report.page || 'page.vue'}`).default : null,
    dashboard: report.dashboard !== null ? require(`@/reports/${report.slug}/${report.dashboard || 'dashboard.vue'}`).default : null
  }

  if (item.dashboard) {
    dashboard.components[item.slug] = item.dashboard
    dashboard.names.push(item.slug)
  }

  return item
})

export default { list, dashboard }
