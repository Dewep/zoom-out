import Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import _ from 'lodash'

HighchartsExporting(Highcharts)

export function generateChart(ref, type, series, title=null, tooltipValue=null, options={}) {
  if (!tooltipValue) {
    tooltipValue = '{point.y}'
  }
  let tooltipPrefix = '{series.name}: '
  if (series.length < 2) {
    tooltipPrefix = ''
  }

  let defaultOptions = {
    chart: {
      renderTo: ref,
      backgroundColor: null,
      plotBackgroundColor: null,
      type: type
    },
    credits: {
      enabled: false
    },
    title: {
      text: title || null
    },
    tooltip: {
      pointFormat: '<span style="color:{point.color}">\u25CF</span> ' + tooltipPrefix + '<b>' + tooltipValue + '</b><br/>'
    },
    series: series
  }

  return Highcharts.chart(_.merge(defaultOptions, options))
}

export default Highcharts
