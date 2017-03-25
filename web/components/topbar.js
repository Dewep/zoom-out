import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { updateModel } from '../state/actions/project'

class TopBar extends React.Component {
  editCurrentModel(model, event) {
    event.preventDefault()
    if (this.props.currentModel !== model) {
      this.props.updateModel(model)
    }
  }

  render() {
    const listModels = _.map(this.props.models, (modelConfig, modelName) =>
      <li key={ modelName } className={ this.props.currentModel === modelName ? 'active' : '' }>
        <a href="#" onClick={ this.editCurrentModel.bind(this, modelName) }>{ modelName }</a>
      </li>
    )

    return (
      <header className="topbar">
        <h1><a href="/">zoom-out <span>{ this.props.name }</span></a></h1>
        <ul>{ listModels }</ul>
      </header>
    )
  }
}

TopBar = connect((state) => ({
  name: state.project.name,
  models: state.project.models,
  currentModel: state.project.currentModel
}), { updateModel })(TopBar)

export default TopBar
