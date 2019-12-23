import React from 'react'
import _ from 'lodash'
import BaseChart from './base-chart'
import { formatNumber } from './utils'

class TableChart extends BaseChart {
  constructor(props) {
    super(props)

    const tableTitles = props.config.splitFields.map(field => {
      return (<th key={ field }>{ field }</th>)
    })
    tableTitles.push(<th key="_total" className="stat-cell">total</th>)
    tableTitles.push(<th key="_avg" className="stat-cell">{ props.config.field }</th>)

    this.state = {
      title: props.config.title || `${props.config.field} stat`,
      suffix: props.config.suffix ? ` ${props.config.suffix}` : '',
      tableTitles
    }
  }

  query() {
    if (!this.props.state) {
      let aggregations = {}
      let nextAggregation = aggregations
      this.props.config.splitFields.forEach(field => {
        nextAggregation[field] = { terms: { field, size: 50 }, aggregations: {} }
        nextAggregation = nextAggregation[field].aggregations
      })
      nextAggregation.stat = { avg: { field: this.props.config.field } }
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

  generateRows(array, keys, object) {
    if (keys.length < this.props.config.splitFields.length) {
      const field = this.props.config.splitFields[keys.length]
      object[field].buckets.forEach(bucket => {
        this.generateRows(array, [...keys, bucket.key], bucket)
      })
    } else {
      array.push({
        id: keys.join('#'),
        keys,
        total: object.doc_count,
        avg: object.stat.value,
        warning: this.props.config.warning && object.stat.value >= this.props.config.warning
      })
    }
  }

  render() {
    this.setJsonProps(this.props)

    let rows = []
    let style = {}

    if (this.props.state && this.props.state.loading === true) {
      style.opacity = 0.5
    }

    if (this.props.state && this.props.state.data) {
      this.generateRows(rows, [], this.props.state.data.aggregations)
      rows.sort((a, b) => b.avg - a.avg)
    }

    const rowsHtml = rows.map(data => {
      const columns = data.keys.map((key, index) => {
        return (<td key={ data.id + '#' + this.props.config.splitFields[index] }>{ key }</td>)
      })
      columns.push(<td key={ data.id + '#_total' } className="stat-cell">{ formatNumber(data.total) }</td>)
      columns.push(<td key={ data.id + '#_avg' } className={ "stat-cell" + (data.warning ? " warning" : "") }>{ formatNumber(data.avg) }{ this.state.suffix }</td>)
      return (<tr key={ data.id }>{ columns }</tr>)
    })

    return (
      <figure className="table-stat">
        <h3>{ this.state.title }</h3>
        <table style={ this.props.style }>
          <thead>
            <tr>{ this.state.tableTitles }</tr>
          </thead>
          <tbody>{ rowsHtml }</tbody>
        </table>
      </figure>
    )
  }
}

export default TableChart
