import React from 'react'
import _ from 'lodash'
import { model } from '../../../common'
import { generateChart } from './highcharts'
import { queryAggregations, getCategories } from './utils'

class ColumnChart extends React.Component {
  renderChart(props) {
    let storeState = props.store.getState()
    let categories = getCategories(props.config.x.categories)
    let filters = props.filters

    let aggregations = {
      columns: {
        terms: {
          field: props.config.x.field
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

    if (categories && categories.length) {
      aggregations.columns.terms.size = categories.length
      filters = { ...filters, [props.config.x.field]: categories }
    }

    if (props.config.split) {
      aggregations = {
        split: {
          terms: {
            field: props.config.split.field
          },
          aggregations: aggregations
        }
      }
    }

    queryAggregations(storeState, filters, aggregations).then(response => {
      let series = []

      if (!categories || !categories.length) {
        categories = []
        if (props.config.split) {
          console.warn('[column-chart] You should not use a split without set explicit categories.')
          categories = _.uniq(_.flatten(_.map(response.data.aggregations.split.buckets, b => _.map(b.columns.buckets, b2 => b2.key))))
        } else {
          categories = _.map(response.data.aggregations.columns.buckets, b => b.key)
        }
      }

      let computeSerie = (buckets) => {
        return _.map(categories, cat => {
          let item = _.find(buckets, { key: cat })
          return item && item.value.value || 0
        })
      }

      if (props.config.split) {
        let field = model.getField(storeState.project.models[storeState.project.currentModel].definition, props.config.split.field)
        series = _.map(response.data.aggregations.split.buckets, b => {
          return {
            name: model.getValueLabel(field, b.key),
            data: computeSerie(b.columns.buckets)
          }
        })
      } else {
        series.push({
          name: 'data',
          data: computeSerie(response.data.aggregations.columns.buckets)
        })
      }
      if (this.chart) {
        this.chart.destroy()
      }
      let options = {
        tooltip: {
          shared: true,
          crosshairs: true
        },
        plotOptions: {
          column: {
            stacking: props.config.stacked === true ? 'normal' : undefined
          }
        },
        xAxis: {
          categories: categories,
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
      this.chart = generateChart(this.chartRef, 'column', series, props.config.title || `${props.config.y.field} by ${props.config.x.field}`, options)
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

export default ColumnChart
