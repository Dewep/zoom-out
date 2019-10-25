import React from 'react'
import { DatePicker, TimePicker } from '@material-ui/pickers'
import indigoColors from '@material-ui/core/colors/indigo'
import { createMuiTheme } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles'
import moment from 'moment'

const defaultMaterialTheme = createMuiTheme({
  palette: {
    primary: indigoColors,
  },
})

class DateTimePicker extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      isDateOpen: false,
      isTimeOpen: false,
      date: this.props.value || null,
      time: this.props.value || null
    }
  }

  componentDidMount() {
  }

  componentWillUnmount() {
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

  setIsOpen (type, isOpen) {
    if (type === 'date') {
      this.setState({ isDateOpen: isOpen })
    } else if (type === 'time') {
      this.setState({ isTimeOpen: isOpen })
    }
  }

  reset() {
    this.setState({
      isDateOpen: false,
      isTimeOpen: false,
      date: null,
      time: null
    }, this.notifyChange.bind(this))
  }

  onChange(type, date) {
    if (type === 'date') {
      this.setState({
        isDateOpen: false,
        isTimeOpen: false,
        date: date,
        time: moment().startOf('day').toDate()
      }, this.notifyChange.bind(this))
    } else if (type === 'time' && this.state.date) {
      this.setState({
        isDateOpen: false,
        isTimeOpen: false,
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
        <a href="#" onClick={ this.setIsOpen.bind(this, 'date', true) }>
          { date }
        </a>
        { ' ' }
        <a href="#" onClick={ this.setIsOpen.bind(this, 'time', true) }>
          { time }
        </a>
        <ThemeProvider theme={defaultMaterialTheme}>
          <DatePicker
            open={ this.state.isDateOpen }
            onOpen={ this.setIsOpen.bind(this, 'date', true) }
            onClose={ this.setIsOpen.bind(this, 'date', false) }
            name={ `date-picker-${this.props.name}` }
            disableFuture={ false }
            value={ this.state.date }
            onChange={ this.onChange.bind(this, 'date') }
            cancelLabel="Remove"
            onDismiss={ this.reset.bind(this) }
            style={ hiddenStyle } />
          <TimePicker
            open={ this.state.isTimeOpen }
            onOpen={ this.setIsOpen.bind(this, 'time', true) }
            onClose={ this.setIsOpen.bind(this, 'time', false) }
            name={ `time-picker-${this.props.name}` }
            ampm={ false }
            value={ this.state.time }
            onChange={ this.onChange.bind(this, 'time') }
            format="24hr"
            style={ hiddenStyle } />
        </ThemeProvider>
      </span>
    )
  }
}

export default DateTimePicker
