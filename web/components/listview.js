import axios from 'axios'
import Inferno from 'inferno'
import Component from 'inferno-component'
import _ from 'lodash'

class ListView extends Component {
  constructor(props) {
    super(props)
    let storeState = this.props.store.getState()
    this.state = {
      loading: false,
      filters: _.cloneDeep(storeState.filters),
      currentModel: storeState.project.currentModel,
      model: storeState.project.models[storeState.project.currentModel],
      results: [],
      page: 0,
      loadMore: false,
      selected: -1
    }
  }

  componentDidMount() {
    this.unsubscribeStore = this.props.store.subscribe(() => {
      let storeState = this.props.store.getState()
      let updateResultsNeeded = false

      if (this.state.currentModel != storeState.project.currentModel) {
        this.setState({
          currentModel: storeState.project.currentModel,
          model: storeState.project.models[storeState.project.currentModel],
          loading: true,
          page: 1,
          results: [],
          selected: -1
        }, this.updateResults.bind(this))
        updateResultsNeeded = true
      }

      if (!_.isEqual(this.state.filters, storeState.filters)) {
        this.setState({
          filters: _.cloneDeep(storeState.filters),
          loading: true,
          page: 1,
          results: [],
          selected: -1
        }, this.updateResults.bind(this))
        updateResultsNeeded = true
      }
    })

    if (!this.state.page) {
      this.setState({ loading: true }, this.updateResults.bind(this))
    }
  }

  componentWillUnmount() {
    this.unsubscribeStore()
  }

  updateResults() {
    let storeState = this.props.store.getState()
    let page = this.state.page

    if (!page) {
      page = 1
    }

    axios.post(storeState.project.hostname + '/api/models/' + this.state.currentModel + '/query/list/', {
      filters: this.state.filters,
      page: page
    }, {
      headers: {
        Authorization: storeState.project.apiKey
      }
    }).then(response => {
      let results = _.concat(this.state.results, response.data.data)
      this.setState({
        loading: false,
        results: results,
        page: this.state.page + 1,
        loadMore: results.length < response.data.total
      })
    }).catch(console.error)
  }

  select(index) {
    this.setState({
      selected: index
    })
  }

  getTableLines(data, prefix='') {
    let items = []
    _.forEach(data, (value, key) => {
      if (_.isObject(value)) {
        _.forEach(this.getTableLines(value, `${prefix}${key}.`), i => items.push(i))
      } else if (_.isArray(value)) {
        items.push(
          <tr><th>{ prefix + key }</th><td>{ value.join(', ') }</td></tr>
        )
      } else {
        items.push(
          <tr><th>{ prefix + key }</th><td>{ value }</td></tr>
        )
      }
    })
    return items
  }

  render() {
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g // Mustache syntax: "{{ variable }}"
    let templateTitle = _.template(this.state.model.list.title)
    let templateDescription = _.template(this.state.model.list.description)
    let templateMeta = _.template(this.state.model.list.meta)
    let selected = ''

    let itemsList = _.map(this.state.results, (item, index) =>
      <li className={ index === this.state.selected ? 'active' : '' } onClick={ this.select.bind(this, index) }>
        <span class="meta">{ templateMeta(item) }</span>
        <span class="title">{ templateTitle(item) }</span>
        <span class="description">{ templateDescription(item) }</span>
      </li>
    )

    if (this.state.loading) {
      itemsList.push(
        <li>Loading...</li>
      )
    } else if (this.state.loadMore) {
      itemsList.push(
        <li onClick={ this.updateResults.bind(this) }>Load more</li>
      )
    }

    if (this.state.selected >= 0 && this.state.selected < this.state.results.length) {
      selected = (
        <article class="active">
          <h2>{ templateTitle(this.state.results[this.state.selected]) }</h2>
          <table>
            <tbody>{ this.getTableLines(this.state.results[this.state.selected]) }</tbody>
          </table>
        </article>
      )
    }

    return (
      <section class="general-view list-view">
        <ul>{ itemsList }</ul>
        { selected }
      </section>
    )
  }
}

export default ListView
