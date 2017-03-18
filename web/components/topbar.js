import React from 'react'
import _ from 'lodash'
import { updateModel } from '../actions'

class TopBar extends React.Component {
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
    if (this.state.store.project.currentModel !== model) {
      this.props.store.dispatch(updateModel(model))
    }
  }

  render() {
    const listModels = _.map(this.state.store.project.models, (modelConfig, modelName) =>
      <li key={ modelName } className={ this.state.store.project.currentModel === modelName ? 'active' : '' }>
        <a href="#" onClick={ this.editCurrentModel.bind(this, modelName) }>{ modelName }</a>
      </li>
    )

    return (
      <header className="topbar">
        <h1><a href="/">zoom-out <span>{ this.state.store.project.name }</span></a></h1>
        <ul>{ listModels }</ul>
      </header>
    )
  }
}

export default TopBar
