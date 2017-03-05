import axios from 'axios'
import Inferno from 'inferno'
import Component from 'inferno-component'
import _ from 'lodash'
import { generateChart } from './highcharts'

class PieChart extends Component {
  renderChart(props) {
    let storeState = props.store.getState()
    let aggregations = {
      values: {
        terms: {
          field: props.config.field
        }
      }
    }
    axios.post('/api/models/' + storeState.project.currentModel + '/query/aggregations/', {
      filters: props.filters,
      filterExclude: props.config.field,
      aggregations: aggregations
    }, {
      headers: {
        Authorization: storeState.project.apiKey
      }
    }).then(response => {
      let series = [{
        name: props.config.field,
        data: _.map(response.data.aggregations.values.buckets, bucket => {
          return {
            name: bucket.key,
            y: bucket.doc_count
          }
        })
      }]
      if (this.chart) {
        this.chart.destroy()
      }
      this.chart = generateChart(this.chartRef, 'pie', series, props.config.title || `${props.config.field} distribution`)
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

export default PieChart
