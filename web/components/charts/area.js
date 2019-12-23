import axios from 'axios'
import React from 'react'
import _ from 'lodash'
import moment from 'moment'
import { generateChart } from './highcharts'
import BaseChart from './base-chart'

class AreaChart extends BaseChart {
  renderChart(props) {
    this.setJsonProps(props)

    if (!props.state) {
      let aggregations = {
        lines: {
          terms: {
            field: props.config.split.field,
            size: 50
          },
          aggregations: {
            ranges: {
              date_range: {
                field: props.config.x.field,
                ranges: this.buildDateRanges(props.config.x, props)
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

      return props.onQuery(props.filters, aggregations)
    }

    if (props.state.loading === true && this.chart) {
      this.chart.showLoading()
    }

    if (props.state.loading === false && this.chart) {
      this.chart.hideLoading()
    }

    if (props.state.data) {
      let xAxis = []
      let series = _.map(props.state.data.aggregations.lines.buckets, bucket => {
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

      if (this.chart && this.chart.destroy) {
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
          area: {
            stacking: props.config.stacked === true ? 'normal' : undefined,
            lineWidth: 1
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
      this.chart = generateChart(this.chartRef, 'area', series, props.config.title || `${props.config.y.field} by ${props.config.x.field}`, options)
    }
  }

  shouldComponentUpdate(nextProps) {
    if (this.isJsonPropsDiffer(nextProps)) {
      this.renderChart(nextProps)
    }
    return false
  }

  componentDidMount() {
    this.renderChart(this.props)
  }

  componentWillUnmount() {
    if (this.chart && this.chart.destroy) {
      this.chart.destroy()
    }
  }

  render() {
    return (
      <figure ref={ ref => { this.chartRef = ref } } style={ this.props.style } />
    )
  }
}

export default AreaChart
