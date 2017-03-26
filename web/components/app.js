import React from 'react'
import { connect } from 'react-redux'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import _ from 'lodash'
import { fetchAndLoad } from '../state/actions/project'
import TopBar from './topbar'
import Facets from './facets'
import ListView from './listview/listview'
import ChartsView from './chartsview'

class App extends React.Component {
  componentDidMount() {
    if (this.props.loading === null) {
      this.props.fetchAndLoad()
    }
  }

  componentDidUpdate() {
    if (this.props.loading === null) {
      this.props.fetchAndLoad()
    }
  }

  render() {
    if (this.props.loading === true || this.props.loading === null) {
      return (
        <div className="app-container">
          <i>Loading...</i>
        </div>
      )
    }

    if (!this.props.currentModel) {
      return (
        <div className="app-container">
          <h1>{ this.props.name }</h1>
          <i>No model found.</i>
        </div>
      )
    }

    let view = ''

    if (this.props.currentView === 'charts') {
      view = (<ChartsView store={ this.props.store } />)
    } else {
      view = (<ListView />)
    }

    return (
      <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
        <div className="app-container">
          <TopBar store={ this.props.store } />
          <section className="page-container">
            <Facets store={ this.props.store } />
            { view }
          </section>
        </div>
      </MuiThemeProvider>
    )
  }
}

App = connect((state) => ({
  loading: state.project.loading,
  name: state.project.name,
  currentModel: state.project.currentModel,
  currentView: state.project.currentView
}), { fetchAndLoad })(App)

export default App
