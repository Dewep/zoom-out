import Inferno from 'inferno'
import Component from 'inferno-component'
import _ from 'lodash'
import { updateProject } from './actions'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      project: null,
      model: null
    }
  }

  componentDidMount() {
    this.unsubscribeStore = this.props.store.subscribe(() => {
      let state = this.props.store.getState()

      if (!this.state.project && state.project.name) {
        this.setState({ project: state.project.name })
      }

      if (!this.state.model && state.project.models) {
        _.some(state.project.models, (modelConfig, modelName) => {
          this.setState({ model: modelName })
          return true
        })
      }
    })

    updateProject(this.props.store)
  }

  componentWillUnmount() {
    this.unsubscribeStore()
  }

  render() {
    if (!this.state.project) {
      return (
        <div>
          <i>Loading...</i>
        </div>
      )
    }

    if (!this.state.model) {
      return (
        <div>
          <h1>{ this.state.project }</h1>
          <i>No model found.</i>
        </div>
      )
    }

    return (
      <div>
        <h1>{ this.state.project }</h1>
        <h2>{ this.state.model }</h2>
      </div>
    )
  }
}

export default App
