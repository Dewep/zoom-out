import React from 'react'
import _ from 'lodash'
import { updateProject } from '../actions'
import TopBar from './topbar'
import Facets from './facets'
import ListView from './listview'
import ChartsView from './chartsview'

class App extends React.Component {
  constructor(props) {
    super(props)
    let storeState = this.props.store.getState()
    this.state = {
      projectName: storeState.project.name,
      currentModel: storeState.project.currentModel,
      currentView: storeState.project.currentView
    }
  }

  componentDidMount() {
    this.unsubscribeStore = this.props.store.subscribe(() => {
      let storeState = this.props.store.getState()
      if (this.state.projectName !== storeState.project.name || this.state.currentModel !== storeState.project.currentModel || this.state.currentView !== storeState.project.currentView) {
        this.setState({
          projectName: storeState.project.name,
          currentModel: storeState.project.currentModel,
          currentView: storeState.project.currentView
        })
      }
    })

    updateProject(this.props.store)
  }

  componentWillUnmount() {
    this.unsubscribeStore()
  }

  render() {
    if (!this.state.projectName) {
      return (
        <div className="app-container">
          <i>Loading...</i>
        </div>
      )
    }

    if (!this.state.currentModel) {
      return (
        <div className="app-container">
          <h1>{ this.state.projectName }</h1>
          <i>No model found.</i>
        </div>
      )
    }

    let view = ''

    if (this.state.currentView === 'charts') {
      view = (<ChartsView store={ this.props.store } />)
    } else {
      view = (<ListView store={ this.props.store } />)
    }

    return (
      <div className="app-container">
        <TopBar store={ this.props.store } />
        <section className="page-container">
          <Facets store={ this.props.store } />
          { view }
        </section>
      </div>
    )
  }
}

export default App
