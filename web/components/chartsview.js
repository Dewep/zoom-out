import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { query } from '../../state/actions/charts'
import StatChart from './charts/stat'
import ColumnChart from './charts/column'
import PieChart from './charts/pie'
import LineChart from './charts/line'
import AreaChart from './charts/area'

class ChartsView extends React.Component {
  query(chartId, filters, aggregations, filterExclude) {
    // todo
  }

  render() {
    let chartsList = _.map(this.props.model.charts, (chart, index) => {
      let width = (chart.width || 1.0) * 100
      let style = {
        width: `calc(${width}% - 20px)`
      }
      if (chart.height) {
        style.height = `${chart.height}px`
      }
      let charts = {
        stat: StatChart,
        column: ColumnChart,
        pie: PieChart,
        line: LineChart,
        area: AreaChart
      }

      let ChartComponent = charts[chart.type] || null
      let chardId = `${this.props.currentModel}-${index}`

      let filters = {...this.props.filters}
      if (chart.filters) {
        _.forEach(chart.filters, (filterValue, filterKey) => {
          filters[filterKey] = filterValue
        })
      }

      if (ChartComponent) {
        return (
          <ChartComponent key={chardId} filters={filters} model={this.props.model} data={this.props.charts[chardId]} onQuery={this.query.bind(this, chardId)} config={chart} style={style} />
        )
      } else {
        style.textAlign = 'center'
        return (
          <p key={ chardId } style={ style }>Chart not found!</p>
        )
      }
    })

    return (
      <section className="general-view charts-view">
        { chartsList }
      </section>
    )
  }
}

ChartsView = connect((state) => ({
  currentModel: state.project.currentModel,
  model: state.project.models[state.project.currentModel],
  filters: state.filters,
  charts: state.charts
}), { query })(ChartsView)

export default ChartsView
