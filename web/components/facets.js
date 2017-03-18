import React from 'react'
import _ from 'lodash'
import { updateFacets, toggleFilter, updateView } from '../actions'
import { model } from '../../common'

import DatePicker from 'material-ui/DatePicker'

class Facets extends React.Component {
  constructor(props) {
    super(props)
    let storeState = this.props.store.getState()
    this.state = {
      loading: false,
      filters: _.cloneDeep(storeState.filters),
      currentModel: storeState.project.currentModel,
      currentView: storeState.project.currentView,
      model: storeState.project.models[storeState.project.currentModel],
      total: storeState.facets.total,
      buckets: _.cloneDeep(storeState.facets.buckets)
    }
  }

  componentDidMount() {
    this.unsubscribeStore = this.props.store.subscribe(() => {
      let storeState = this.props.store.getState()
      let updateFacetsNeeded = false

      if (this.state.total !== storeState.facets.total || !_.isEqual(this.state.buckets, storeState.facets.buckets)) {
        this.setState({
          loading: false,
          total: storeState.facets.total,
          buckets: _.cloneDeep(storeState.facets.buckets)
        })
      }

      if (this.state.currentView != storeState.project.currentView) {
        this.setState({
          currentView: storeState.project.currentView
        })
      }

      if (this.state.currentModel != storeState.project.currentModel) {
        this.setState({
          currentModel: storeState.project.currentModel,
          model: storeState.project.models[storeState.project.currentModel]
        })
        updateFacetsNeeded = true
      }

      if (!_.isEqual(this.state.filters, storeState.filters)) {
        this.setState({
          filters: _.cloneDeep(storeState.filters)
        })
        updateFacetsNeeded = true
      }

      if (updateFacetsNeeded) {
        this.setState({ loading: true })
        updateFacets(this.props.store)
      }
    })

    let storeState = this.props.store.getState()
    if (!storeState.facets.initialized) {
      this.setState({ loading: true })
      updateFacets(this.props.store)
    }
  }

  componentWillUnmount() {
    this.unsubscribeStore()
  }

  isFacetFieldActive(field, key) {
    if (!this.state.filters[field]) {
      return false
    }
    return this.state.filters[field].indexOf(key) !== -1
  }

  toggleFilter(field, key, event) {
    event.preventDefault()
    this.props.store.dispatch(toggleFilter(field, key))
  }

  updateCurrentView(view) {
    if (this.state.currentView !== view) {
      this.props.store.dispatch(updateView(view))
    }
  }

  render() {
    let facetsList = []

    _.forEach(this.state.model.facets, fieldName => {
      let field = model.getField(this.state.model.definition, fieldName)

      if (field && field.type === 'keyword' && this.state.buckets[fieldName]) {
        const values = _.map(this.state.buckets[fieldName].buckets, bucket =>
          <li key={ bucket.key } onClick={ this.toggleFilter.bind(this, fieldName, bucket.key) } className={ this.isFacetFieldActive(fieldName, bucket.key) ? 'active' : '' }>
            <span className="facet-check"></span>
            <span className="facet-value">{ bucket.key }</span>
            <span className="facet-count">{ bucket.total }</span>
          </li>
        )

        let missings = ''
        if (this.state.buckets[fieldName].missings) {
          missings = (
            <li onClick={ this.toggleFilter.bind(this, fieldName, null) } className={ this.isFacetFieldActive(fieldName, null) ? 'active' : '' }>
              <span className="facet-check"></span>
              <span className="facet-value"><i>Missings</i></span>
              <span className="facet-count">{ this.state.buckets[fieldName].missings }</span>
            </li>
          )
        }

        facetsList.push(
          <li key={ fieldName } className="facet">
            <span className="facet-name">{ fieldName }</span>
            <ul>
              { values }
              { missings }
            </ul>
          </li>
        )
      } else if (field && field.type === 'date') {
        facetsList.push(
          <li key={ fieldName } className="facet">
            <span className="facet-name">{ fieldName }</span>
          </li>
        )
      }
    })
    //            <DatePicker hintText="Start date" />

    return (
      <section className="sidebar">
        <nav className="facets">
          <header>
            <div className="selection-group">
              <button type="button" className={ this.state.currentView === 'list' ? 'active' : '' } onClick={ this.updateCurrentView.bind(this, 'list') }>list</button>
              <button type="button" className={ this.state.currentView === 'charts' ? 'active' : '' } onClick={ this.updateCurrentView.bind(this, 'charts') }>charts</button>
            </div>
            <div className="total">
              <em>{ this.state.total }</em> result{ this.state.total > 0 ? 's' : '' }
              { this.state.loading ? ' (loading)' : '' }
            </div>
          </header>
          <ul>{ facetsList }</ul>
        </nav>
      </section>
    )
  }
}

export default Facets
