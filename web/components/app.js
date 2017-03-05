import Inferno from 'inferno'
import Component from 'inferno-component'
import _ from 'lodash'
import { updateProject } from '../actions'
import TopBar from './topbar'
import Facets from './facets'
import ListView from './listview'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      store: this.props.store.getState()
    }
  }

  componentDidMount() {
    this.unsubscribeStore = this.props.store.subscribe(() => {
      this.setState({ store: this.props.store.getState() })
    })

    updateProject(this.props.store)
  }

  componentWillUnmount() {
    this.unsubscribeStore()
  }

  render() {
    if (!this.state.store.project.name) {
      return (
        <div class="app-container">
          <i>Loading...</i>
        </div>
      )
    }

    if (!this.state.store.project.currentModel) {
      return (
        <div class="app-container">
          <h1>{ this.state.store.project.name }</h1>
          <i>No model found.</i>
        </div>
      )
    }

    return (
      <div class="app-container">
        <TopBar store={ this.props.store } />
        <section class="page-container">
          <Facets store={ this.props.store } />
          <ListView store={ this.props.store } />
        </section>
      </div>
    )
  }
}

export default App
