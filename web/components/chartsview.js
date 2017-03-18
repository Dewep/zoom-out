import axios from 'axios'
import React from 'react'
import _ from 'lodash'
import PieChart from './charts/pie'
import LineChart from './charts/line'
import AreaChart from './charts/area'

class ChartsView extends React.Component {
  constructor(props) {
    super(props)
    let storeState = this.props.store.getState()
    this.state = {
      filters: _.cloneDeep(storeState.filters),
      currentModel: storeState.project.currentModel,
      model: storeState.project.models[storeState.project.currentModel]
    }
  }

  componentDidMount() {
    this.unsubscribeStore = this.props.store.subscribe(() => {
      let storeState = this.props.store.getState()

      if (this.state.currentModel != storeState.project.currentModel) {
        this.setState({
          currentModel: storeState.project.currentModel,
          model: storeState.project.models[storeState.project.currentModel]
        })
      }

      if (!_.isEqual(this.state.filters, storeState.filters)) {
        this.setState({
          filters: _.cloneDeep(storeState.filters)
        })
      }
    })
  }

  componentWillUnmount() {
    this.unsubscribeStore()
  }

  render() {
    let chartsList = _.map(this.state.model.charts, (chart, index) => {
      let width = (chart.width || 1.0) * 100
      let style = {
        width: `calc(${width}% - 20px)`
      }
      let charts = {
        pie: PieChart,
        line: LineChart,
        area: AreaChart
      }
      let filters = _.clone(this.state.filters)
      let ChartComponent = charts[chart.type] || null
      if (chart.filters) {
        _.forEach(chart.filters, (filterValue, filterKey) => {
          filters[filterKey] = filterValue
        })
      }

      if (ChartComponent) {
        return (
          <ChartComponent key={ `${this.state.currentModel}-${index}` } store={ this.props.store } filters={ filters } model={ this.state.model } config={ chart } style={ style } />
        )
      } else {
        style.textAlign = center
        return (
          <p key={ `${this.state.currentModel}-${index}` } style={ style }>Chart not found!</p>
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

export default ChartsView
