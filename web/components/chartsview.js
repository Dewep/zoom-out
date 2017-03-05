import axios from 'axios'
import Inferno from 'inferno'
import Component from 'inferno-component'
import _ from 'lodash'
import PieChart from './charts/pie'

class ChartsView extends Component {
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
    let chartsList = _.map(this.state.model.charts, chart => {
      let width = (chart.width || 1.0) * 100
      let style = {
        width: `calc(${width}% - 20px)`
      }

      if (chart.type === 'pie') {
        return (
          <PieChart store={ this.props.store } filters={ this.state.filters } model={ this.state.model } config={ chart } style={ style } />
        )
      } else {
        style.textAlign = center
        return (<p style={ style }>Chart not found!</p>)
      }
    })

    return (
      <section class="general-view charts-view">
        { chartsList }
      </section>
    )
  }
}

export default ChartsView
