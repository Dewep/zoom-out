import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { updateModel, toggleSidebar } from '../state/actions/project'

class TopBar extends React.Component {
  editCurrentModel(model, event) {
    event.preventDefault()
    if (this.props.currentModel !== model) {
      this.props.updateModel(model)
    }
  }

  toggleSidebar (event) {
    event.preventDefault()
    this.props.toggleSidebar()
  }

  render() {
    const listModels = _.map(this.props.models, (modelConfig, modelName) =>
      <li key={ modelName } className={ this.props.currentModel === modelName ? 'active' : '' }>
        <a href="#" onClick={ this.editCurrentModel.bind(this, modelName) }>{ modelName }</a>
      </li>
    )

    return (
      <header className="topbar">
        <h1>
          <a href="#" className="hamburger" onClick={ this.toggleSidebar.bind(this) }><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHMAAABkCAMAAACCTv/3AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAZQTFRF////5ubmueBsSwAAAAJ0Uk5T/wDltzBKAAAAPklEQVR42uzYQQ0AAAgDseHfNC4IyVoD912WAACUm3uampqampqamq+aAAD+IVtTU1NTU1NT0z8EAFBsBRgAX+kR+Qam138AAAAASUVORK5CYII="/></a>
          <a href="/">zoom-out { this.props.name }<span>{ this.props.currentModel }</span></a>
        </h1>
        <ul>{ listModels }</ul>
      </header>
    )
  }
}

TopBar = connect((state) => ({
  name: state.project.name,
  models: state.project.models,
  currentModel: state.project.currentModel
}), { updateModel, toggleSidebar })(TopBar)

export default TopBar
