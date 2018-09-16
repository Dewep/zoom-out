import React from 'react'
import _ from 'lodash'
import { formatNumber, formatSize } from './utils'
import BaseChart from './base-chart'

class StatChart extends BaseChart {
  constructor(props) {
    super(props)

    this.state = {
      title: props.config.title || `${props.config.field} stat`,
      suffix: props.config.suffix ? ` ${props.config.suffix}` : ''
    }
  }

  query() {
    if (!this.props.state) {
      let aggregations = {
        stat: {
          [this.props.config.aggregation]: {
            field: this.props.config.field
          }
        }
      }
      this.props.onQuery(this.props.filters, aggregations)
    }
  }

  componentDidMount() {
    this.query()
  }

  componentDidUpdate() {
    this.query()
  }

  shouldComponentUpdate(nextProps) {
    return this.isJsonPropsDiffer(nextProps)
  }

  render() {
    this.setJsonProps(this.props)

    let value = '-'
    let style = {}

    if (this.props.state && this.props.state.loading === true) {
      style.opacity = 0.5
    }

    if (this.props.state && this.props.state.data) {
      if (this.props.config.format === 'size') {
        value = formatSize(this.props.state.data.aggregations.stat.value, this.props.config.decimal)
      } else {
        value = formatNumber(this.props.state.data.aggregations.stat.value, this.props.config.decimal)
      }
    }

    return (
      <figure style={ this.props.style } className="stat">
        <em style={ style }>{ value }{ this.state.suffix }</em>
        <p>{ this.state.title }</p>
      </figure>
    )
  }
}

export default StatChart
