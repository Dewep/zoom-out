import React from 'react'
import _ from 'lodash'

class StatChart extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      title: props.config.title || `${props.config.field} stat`
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

  render() {
    let value = '-'
    let style = {}

    if (this.props.state && this.props.state.loading === true) {
      style.opacity = 0.5
    }

    if (this.props.state && this.props.state.data) {
      value = Math.round(this.props.state.data.aggregations.stat.value * 100) / 100
    }

    return (
      <figure style={ this.props.style } className="stat">
        <em style={ style }>{ value }</em>
        <p>{ this.state.title }</p>
      </figure>
    )
  }
}

export default StatChart
