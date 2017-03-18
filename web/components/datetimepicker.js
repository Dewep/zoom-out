import React from 'react'
import DatePicker from 'material-ui/DatePicker'
import TimePicker from 'material-ui/TimePicker'
import moment from 'moment'

class DateTimePicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      date: this.props.value || null,
      time: this.props.value || null
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  saveRef(type, ref) {
    if (type === 'date') {
      this.dateRef = ref
    } else if (type === 'time') {
      this.timeRef = ref
    }
  }

  openPicker(type, event) {
    event && event.preventDefault()
    if (type === 'date' && this.dateRef) {
      this.dateRef.openDialog()
    } else if (type === 'time' && this.state.date && this.timeRef) {
      this.timeRef.openDialog()
    }
  }

  notifyChange() {
    let value = null

    if (this.state.date && this.state.time) {
      let time = moment(this.state.time)
      value = moment(this.state.date).startOf('day').hour(time.hour()).minute(time.minute()).toDate()
    }

    if (this.props.onChange) {
      this.props.onChange(this.props.name, value)
    }
  }

  reset() {
    this.setState({
      date: null,
      time: null
    }, this.notifyChange.bind(this))
  }

  onChange(type, event, date) {
    if (type === 'date') {
      this.setState({
        date: date,
        time: moment().startOf('day').toDate()
      }, this.notifyChange.bind(this))
    } else if (type === 'time' && this.state.date) {
      this.setState({
        time: date
      }, this.notifyChange.bind(this))
    }
  }

  render() {
    let date = 'select a date'
    let time = ''
    let hiddenStyle = {
      display: 'none'
    }

    if (this.state.date) {
      date = moment(this.state.date).format('MMM Do YYYY')
    }
    if (this.state.date && this.state.time) {
      time = moment(this.state.time).format('HH:mm')
    }

    return (
      <span className="date-time-picker">
        <a href="#" onClick={ this.openPicker.bind(this, 'date') }>
          { date }
          <DatePicker
            ref={ this.saveRef.bind(this, 'date') }
            name={ `date-picker-${this.props.name}` }
            value={ this.state.date }
            onChange={ this.onChange.bind(this, 'date') }
            cancelLabel="Remove"
            onDismiss={ this.reset.bind(this) }
            style={ hiddenStyle } />
        </a>
        { ' ' }
        <a href="#" onClick={ this.openPicker.bind(this, 'time') }>
          { time }
          <TimePicker
            ref={ this.saveRef.bind(this, 'time') }
            name={ `time-picker-${this.props.name}` }
            value={ this.state.time }
            onChange={ this.onChange.bind(this, 'time') }
            format="24hr"
            style={ hiddenStyle } />
        </a>
      </span>
    )
  }
}

export default DateTimePicker
