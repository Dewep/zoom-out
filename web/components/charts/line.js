import axios from 'axios'
import Inferno from 'inferno'
import Component from 'inferno-component'
import _ from 'lodash'
import moment from 'moment'
import { generateChart } from './highcharts'
import { queryAggregations, buildDateRanges } from './utils'

class LineChart extends Component {
  renderChart(props) {
    let storeState = props.store.getState()
    let aggregations = {
      lines: {
        terms: {
          field: props.config.split.field
        },
        aggregations: {
          ranges: {
            date_range: {
              field: props.config.x.field,
              ranges: buildDateRanges(props.config.x.period, props.config.x.tick)
            },
            aggregations: {
              value: {
                [props.config.y.aggregation]: {
                  field: props.config.y.field
                }
              }
            }
          }
        }
      }
    }
    queryAggregations(storeState, props.filters, aggregations).then(response => {
      let xAxis = []
      let series = _.map(response.data.aggregations.lines.buckets, bucket => {
        return {
          name: bucket.key,
          data: _.map(bucket.ranges.buckets, (point, index) => {
            if (index === xAxis.length) {
              xAxis.push(moment(point.from_as_string).format(props.config.x.format))
            }
            return point.value.value
          })
        }
      })
      if (this.chart) {
        this.chart.destroy()
      }
      let options = {
        tooltip: {
          shared: true,
          crosshairs: true
        },
        plotOptions: {
          series: {
            marker: {
              lineWidth: 1
            }
          },
          spline: {
            lineWidth: 2,
            states: {
              hover: {
                lineWidth: 4
              }
            },
            marker: {
              enabled: false
            }
          }
        },
        xAxis: {
          categories: xAxis,
          title: {
            text: props.config.x.label
          }
        },
        yAxis: {
          title: {
            text: props.config.y.label
          }
        }
      }
      this.chart = generateChart(this.chartRef, 'spline', series, props.config.title || `${props.config.y.field} by ${props.config.x.field}`, options)
    }).catch(console.error)
  }

  shouldComponentUpdate(nextProps) {
    this.renderChart(nextProps)
    return false
  }

  componentDidMount() {
    this.renderChart(this.props)
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy()
    }
  }

  render() {
    return (
      <figure ref={ ref => { this.chartRef = ref } } style={ this.props.style } />
    )
  }
}

export default LineChart
