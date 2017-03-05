import Inferno from 'inferno'
import Component from 'inferno-component'
import _ from 'lodash'

class TopBar extends Component {
  constructor(props) {
    super(props)
    this.state = {
      store: this.props.store.getState()
    }
  }

  componentDidMount() {
    this.unsubscribeStore = this.props.store.subscribe(() => {
      this.setState({ store: this.props.store.getState() })
      let state = this.props.store.getState()
    })
  }

  componentWillUnmount() {
    this.unsubscribeStore()
  }

  editCurrentModel(model, event) {
    event.preventDefault()
    console.log('editCurrentModel', model)
  }

  render() {
    const listModels = _.map(this.state.store.project.models, (modelConfig, modelName) =>
      <li className={ this.state.store.project.currentModel === modelName ? 'active' : '' }>
        <a href="#" onClick={ this.editCurrentModel.bind(this, modelName) }>{ modelName }</a>
      </li>
    )

    return (
      <header class="topbar">
        <h1><a href="/">zoom-out <span>{ this.state.store.project.name }</span></a></h1>
        <ul>{ listModels }</ul>
      </header>
    )
  }
}

export default TopBar
