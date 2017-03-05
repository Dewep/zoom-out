import Inferno from 'inferno'
import Component from 'inferno-component'
import _ from 'lodash'
import { updateFacets, toggleFilter } from '../actions'
import { model } from '../../common'

class Facets extends Component {
  constructor(props) {
    super(props)
    let storeState = this.props.store.getState()
    this.state = {
      loading: false,
      filters: _.cloneDeep(storeState.filters),
      currentModel: storeState.project.currentModel,
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

  render() {
    let facetsList = []

    _.forEach(this.state.model.facets, fieldName => {
      let field = model.getField(this.state.model.definition, fieldName)

      if (field && field.type === 'keyword' && this.state.buckets[fieldName]) {
        const values = _.map(this.state.buckets[fieldName].buckets, bucket =>
          <li onClick={ this.toggleFilter.bind(this, fieldName, bucket.key) } className={ this.isFacetFieldActive(fieldName, bucket.key) ? 'active' : '' }>
            <span class="facet-check"></span>
            <span class="facet-value">{ bucket.key }</span>
            <span class="facet-count">{ bucket.total }</span>
          </li>
        )

        facetsList.push(
          <li class="facet">
            <span class="facet-name">{ fieldName }</span>
            <ul>{ values }</ul>
          </li>
        )
      }
    })

    return (
      <section class="sidebar">
        <nav class="facets">
          <header>
            <div class="selection-group">
              <button type="button" class="active">list</button>
              <button type="button">charts</button>
            </div>
            <div class="total">
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
