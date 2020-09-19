import reports from '@/reports/vue'
import ReportDashboard from '@/reports/dashboard/page.vue'

export default function generateReportsRouter (path = '/reports') {
  const routes = [
    {
      path: `${path}`,
      name: 'reports',
      redirect: { name: 'report-message', params: { globalFilters: 'toto' } }
    },
    {
      path: `${path}/dashboard/:globalFilters?`,
      name: 'report-dashboard',
      component: ReportDashboard
    }
  ]

  for (const report of reports.list) {
    if (report.page) {
      routes.push({
        path: `${path}/${report.slug}/:globalFilters?/:filters?`,
        name: `report-${report.slug}`,
        component: report.page
      })
    }
  }

  return routes
}
