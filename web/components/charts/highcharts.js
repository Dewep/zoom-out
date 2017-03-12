import Highcharts from 'highcharts'
import HighchartsExporting from 'highcharts/modules/exporting'
import _ from 'lodash'

HighchartsExporting(Highcharts)

export function generateChart(ref, type, series, title=null, options={}) {
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
    series: series
  }

  return Highcharts.chart(_.merge(defaultOptions, options))
}

export default Highcharts
