import reports from '@/reports/vue'
import ReportsApp from '@/views/reports/page.vue'
import ReportsDashboard from '@/views/reports/dashboard/page.vue'

function mergeProps (props) {
  return function (route) {
    return { ...props, ...route.params }
  }
}

export default function generateReportsRouter (path = '/reports') {
  const routes = [
    {
      path,
      name: 'reports',
      redirect: { name: 'report-dashboard' }
    },
    {
      path: `${path}/dashboard/:filtersQuery?`,
      props: mergeProps({ reportQuery: 'dashboard' }),
      component: ReportsApp,
      children: [
        {
          path: '',
          name: 'report-dashboard',
          component: ReportsDashboard,
          props: true
        }
      ]
    }
  ]

  for (const report of reports.list) {
    if (report.page) {
      routes.push({
        path: `${path}/${report.slug}/:filtersQuery?`,
        props: mergeProps({ reportQuery: report.slug }),
        component: ReportsApp,
        children: [
          {
            path: '',
            name: `report-${report.slug}`,
            component: report.page,
            props: true
          }
        ]
      })
    }
  }

  return routes
}
