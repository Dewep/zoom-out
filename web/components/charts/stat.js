import React from 'react'
import _ from 'lodash'
import { queryAggregations } from './utils'

class StatChart extends React.Component {
  constructor(props) {
    super(props)
    let storeState = props.store.getState()
    this.state = {
      title: props.config.title || `${props.config.field} stat`,
      value: '-'
    }

    let aggregations = {
      stat: {
        [props.config.aggregation]: {
          field: props.config.field
        }
      }
    }

    queryAggregations(storeState, props.filters, aggregations).then(response => {
      this.setState({
        value: Math.round(response.data.aggregations.stat.value * 100) / 100
      })
    }).catch(console.error)
  }

  render() {
    return (
      <figure style={ this.props.style } className="stat">
        <em>{ this.state.value }</em>
        <p>{ this.state.title }</p>
      </figure>
    )
  }
}

export default StatChart
