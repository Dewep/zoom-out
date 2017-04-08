import React from 'react'
import _ from 'lodash'
import { generateChart } from './highcharts'

class PieChart extends React.Component {
  renderChart(props) {
    if (!props.state) {
      let aggregations = {
        values: {
          terms: {
            field: props.config.field
          }
        }
      }

      return props.onQuery(props.filters, aggregations, props.config.field)
    }

    if (props.state.loading === true && this.chart) {
      this.chart.showLoading()
    }

    if (props.state.loading === false && this.chart) {
      this.chart.hideLoading()
    }

    if (props.state.data) {
      let series = [{
        name: props.config.field,
        data: _.map(props.state.data.aggregations.values.buckets, bucket => {
          return {
            name: bucket.key,
            y: bucket.doc_count
          }
        })
      }]

      if (this.chart && this.chart.destroy) {
        this.chart.destroy()
      }

      this.chart = generateChart(this.chartRef, 'pie', series, props.config.title || `${props.config.field} distribution`)
    }
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

export default PieChart
