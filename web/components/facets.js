import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { updateView } from '../state/actions/project'
import { toggleFilter, setFilter } from '../state/actions/filters'
import { fetchAndLoad } from '../state/actions/facets'
import { model } from '../../common'
import DateTimePicker from './datetimepicker'

class Facets extends React.Component {
  componentDidMount() {
    if (this.props.loading === null) {
      this.props.fetchAndLoad(this.props.currentModel, this.props.filters)
    }
  }

  componentDidUpdate() {
    if (this.props.loading === null) {
      this.props.fetchAndLoad(this.props.currentModel, this.props.filters)
    }
  }

  isFacetFieldActive(field, key) {
    if (!this.props.filters[field]) {
      return false
    }

    return this.props.filters[field].indexOf(key) !== -1
  }

  toggleFilter(field, key, event) {
    event.preventDefault()
    this.props.toggleFilter(field, key)
  }

  setDateFilter(field, name, date) {
    let gt = null
    let lt = null
    if (this.props.filters[field]) {
      gt = this.props.filters[field].length > 0 && this.props.filters[field][0] || null
      lt = this.props.filters[field].length > 1 && this.props.filters[field][1] || null
    }

    if (name === 'gt') {
      gt = date && date.toISOString() || null
    } else if (name === 'lt') {
      lt = date && date.toISOString() || null
    } else {
      return console.warn('Bad name setDateFilter:', field, name)
    }

    if (gt === null && lt === null) {
      this.props.setFilter(field, null)
    } else {
      this.props.setFilter(field, [gt, lt])
    }
  }

  getDateFilter(field, name) {
    if (this.props.filters[field]) {
      if (name === 'gt' && this.props.filters[field].length > 0) {
        return new Date(this.props.filters[field][0])
      }
      if (name === 'lt' && this.props.filters[field].length > 1) {
        return new Date(this.props.filters[field][1])
      }
    }
    return null
  }

  updateCurrentView(view) {
    if (this.props.currentView !== view) {
      this.props.updateView(view)
    }
  }

  render() {
    let facetsList = []

    _.forEach(this.props.model.facets, fieldName => {
      let field = model.getField(this.props.model.definition, fieldName)

      if (field && (field.type === 'keyword' || field.type === 'boolean') && this.props.buckets[fieldName]) {
        const values = _.map(this.props.buckets[fieldName].buckets, bucket =>
          <li key={ `${this.props.currentModel}-${bucket.key}` } onClick={ this.toggleFilter.bind(this, fieldName, bucket.key) } className={ this.isFacetFieldActive(fieldName, bucket.key) ? 'active' : '' }>
            <span className="facet-check"></span>
            <span className="facet-value">{ model.getValueLabel(field, bucket.key) }</span>
            <span className="facet-count">{ bucket.total }</span>
          </li>
        )

        let missings = ''
        if (this.props.buckets[fieldName].missings) {
          missings = (
            <li onClick={ this.toggleFilter.bind(this, fieldName, null) } className={ this.isFacetFieldActive(fieldName, null) ? 'active' : '' }>
              <span className="facet-check"></span>
              <span className="facet-value"><i>Missings</i></span>
              <span className="facet-count">{ this.props.buckets[fieldName].missings }</span>
            </li>
          )
        }

        facetsList.push(
          <li key={ `${this.props.currentModel}-${fieldName}` } className="facet">
            <span className="facet-name">{ fieldName }</span>
            <ul>
              { values }
              { missings }
            </ul>
          </li>
        )
      } else if (field && field.type === 'date') {
        facetsList.push(
          <li key={ `${this.props.currentModel}-${fieldName}` } className="facet">
            <span className="facet-name">{ fieldName }</span>
            { 'Greater than: ' }
            <DateTimePicker onChange={ this.setDateFilter.bind(this, fieldName) } name={ 'gt' } value={ this.getDateFilter(field, 'gt') } />
            <br />
            { 'Less than: ' }
            <DateTimePicker onChange={ this.setDateFilter.bind(this, fieldName) } name={ 'lt' } value={ this.getDateFilter(field, 'lt') } />
          </li>
        )
      }
    })

    return (
      <section className="sidebar">
        <nav className="facets">
          <header>
            <div className="selection-group">
              <button type="button" className={ this.props.currentView === 'list' ? 'active' : '' } onClick={ this.updateCurrentView.bind(this, 'list') }>list</button>
              <button type="button" className={ this.props.currentView === 'charts' ? 'active' : '' } onClick={ this.updateCurrentView.bind(this, 'charts') }>charts</button>
            </div>
            <div className="total">
              <em>{ this.props.total }</em> result{ this.props.total > 0 ? 's' : '' }
              { this.props.loading ? ' (loading)' : '' }
            </div>
          </header>
          <ul>{ facetsList }</ul>
        </nav>
      </section>
    )
  }
}

Facets = connect((state) => ({
  currentModel: state.project.currentModel,
  model: state.project.models[state.project.currentModel],
  currentView: state.project.currentView,
  filters: state.filters,
  loading: state.facets.loading,
  total: state.facets.total,
  buckets: state.facets.buckets
}), { updateView, toggleFilter, setFilter, fetchAndLoad })(Facets)

export default Facets
