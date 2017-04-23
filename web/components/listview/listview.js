import React from 'react'
import { connect } from 'react-redux'
import _ from 'lodash'
import { fetchAndLoad, fetchAndLoadMore } from '../../state/actions/list'

class ListView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selected: 0
    }
  }

  componentDidMount() {
    if (this.props.loading === null) {
      this.props.fetchAndLoad(this.props.currentModel, this.props.filters, this.props.model.list.sort)
    }
  }

  componentDidUpdate() {
    if (this.props.loading === null) {
      this.props.fetchAndLoad(this.props.currentModel, this.props.filters, this.props.model.list.sort)
    }
  }

  loadMore() {
    this.props.fetchAndLoadMore(this.props.currentModel, this.props.filters, this.props.model.list.sort, this.props.page + 1)
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
          <tr key={ prefix + key }>
            <th>{ prefix + key }</th>
            <td>{ value.join(', ') }</td>
          </tr>
        )
      } else {
        items.push(
          <tr key={ prefix + key }>
            <th>{ prefix + key }</th>
            <td>{ value }</td>
          </tr>
        )
      }
    })
    return items
  }

  render() {
    _.templateSettings.interpolate = /{{([\s\S]+?)}}/g // Mustache syntax: "{{ variable }}"
    let templateTitle = _.template(this.props.model.list.title)
    let templateDescription = _.template(this.props.model.list.description)
    let templateMeta = _.template(this.props.model.list.meta)
    let selected = ''

    let itemsList = _.map(this.props.results, (item, index) =>
      <li key={ `${this.props.currentModel}-${item._id}` } className={ index === this.state.selected ? 'active' : '' } onClick={ this.select.bind(this, index) }>
        <span className="meta">{ templateMeta(item) }</span>
        <span className="title">{ templateTitle(item) }</span>
        <span className="description">{ templateDescription(item) }</span>
      </li>
    )

    if (this.props.loading) {
      itemsList.push(
        <li key="_loading">Loading...</li>
      )
    } else if (this.props.hasMore) {
      itemsList.push(
        <li key="_load_more" onClick={ this.loadMore.bind(this) }>Load more</li>
      )
    }

    if (this.state.selected >= 0 && this.state.selected < this.props.results.length) {
      selected = (
        <article className="active">
          <a className="cancel-selection" href="#" onClick={ this.select.bind(this, -1) }>&laquo; Back to the results list</a>
          <h2>{ templateTitle(this.props.results[this.state.selected]) }</h2>
          <table>
            <tbody>{ this.getTableLines(this.props.results[this.state.selected]) }</tbody>
          </table>
        </article>
      )
    }

    return (
      <section className={ 'general-view list-view' + (selected ? ' selection' : '') }>
        <ul>{ itemsList }</ul>
        { selected }
      </section>
    )
  }
}

ListView = connect((state) => ({
  currentModel: state.project.currentModel,
  model: state.project.models[state.project.currentModel],
  filters: state.filters,
  loading: state.list.loading,
  results: state.list.data,
  page: state.list.page,
  hasMore: state.list.hasMore
}), { fetchAndLoad, fetchAndLoadMore })(ListView)

export default ListView
