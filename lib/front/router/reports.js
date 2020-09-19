import reports from '@/reports/vue'
import ReportsApp from '@/views/reports/page.vue'
import ReportsDashboard from '@/views/reports/dashboard/page.vue'

export default function generateReportsRouter (path = '/reports') {
  const children = [
    {
      path: '',
      name: 'reports',
      redirect: { name: 'report-dashboard' }
    },
    {
      path: 'dashboard/:globalFilters?',
      name: 'report-dashboard',
      props: true,
      component: ReportsDashboard
    }
  ]

  for (const report of reports.list) {
    if (report.page) {
      children.push({
        path: `${path}/${report.slug}/:globalFilters?/:filters?`,
        name: `report-${report.slug}`,
        props: true,
        component: report.page
      })
    }
  }

  const routes = [
    {
      path: `${path}`,
      component: ReportsApp,
      children
    }
  ]

  return routes
}
