let getWeekDay = (field, data) => {
  let weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  return weekdays[new Date(data[field]).getDay()]
}

let getMonthDay = (field, data) => {
  return new Date(data[field]).getDate()
}

let getHour = (field, data) => {
  return new Date(data[field]).getHours()
}

let getMonth = (field, data) => {
  let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  return months[new Date(data[field]).getMonth()]
}

let clientDefinition = {
  application: {
    type: 'object',
    properties: {
      version: { type: 'keyword' },
      platform: { type: 'keyword' },
      is_websocket: { type: 'boolean' }
    }
  },
  browser: {
    type: 'object',
    properties: {
      name: { type: 'keyword' },
      major: { type: 'keyword' },
      version: { type: 'keyword' },
      engine: {
        type: 'object',
        properties: {
          name: { type: 'keyword' },
          version: { type: 'keyword' }
        }
      },
      screen: { type: 'keyword' }
    }
  },
  os: {
    type: 'object',
    properties: {
      name: { type: 'keyword' },
      version: { type: 'keyword' }
    }
  },
  device: {
    type: 'object',
    properties: {
      vendor: { type: 'keyword' },
      model: { type: 'keyword' }
    }
  }
}

module.exports = {
  apiKeys: ['drpanda-key', 'drpanda-dU7Wbmz1sxD2maiIsJv0fkDwZPsgsp2fEI3qoXdN'],
  project: 'drpanda',
  archiver: 'archives',
  models: {
    message: {
      definition: {
        id: { type: 'keyword' },
        team: { type: 'keyword' },
        chan: { type: 'keyword' },
        user: { type: 'keyword' },
        date: { type: 'date' },
        date_hour: { type: 'keyword', default: getHour.bind(null, 'date') },
        date_day: { type: 'keyword', default: getMonthDay.bind(null, 'date') },
        date_weekday: { type: 'keyword', default: getWeekDay.bind(null, 'date') },
        date_month: { type: 'keyword', default: getMonth.bind(null, 'date') },
        application: clientDefinition.application,
        browser: clientDefinition.browser,
        os: clientDefinition.os,
        device: clientDefinition.device,
        attachment: {
          type: 'object',
          properties: {
            mime_type: { type: 'keyword' },
            size: { type: 'integer' }
          }
        },
        is_chan: { type: 'boolean', default: (data) => data.chan !== null, values: { '0': 'one-to-one', '1': 'chan' } },
        is_attachment: { type: 'boolean', default: (data) => data.attachment && data.attachment.mime_type !== null || false, values: { '0': 'text', '1': 'attachment' } },
        with_styles: { type: 'boolean', values: { '0': 'brut', '1': 'stylized' } },
        size: { type: 'integer' },
        words: { type: 'integer' }
      },
      facets: ['date', 'team', 'is_chan', 'application.version', 'application.platform', 'browser.name', 'browser.major', 'browser.engine.name', 'browser.screen', 'os.name', 'os.version', 'device.vendor', 'device.model', 'attachment.mime_type', 'with_styles'],
      list: {
        sort: [{ date: { order: 'desc' } }],
        title: 'Message {{id}} on {{team}}#{{chan}} by {{user}}',
        description: 'DrPanda {{application.version}} - {{device.name}} {{os.name}} {{os.version}} - {{browser.name}} {{browser.major}}',
        meta: '{{date}}'
      },
      charts: [
        { type: 'stat', width: 0.25, title: 'Number of text messages', filters: { is_attachment: [false] }, field: '_uid', aggregation: 'value_count' },
        { type: 'stat', width: 0.25, title: 'Number of attachments', filters: { is_attachment: [true] }, field: '_uid', aggregation: 'value_count' },
        { type: 'stat', width: 0.25, title: 'Average message size', filters: { is_attachment: [false] }, field: 'size', aggregation: 'avg' },
        { type: 'stat', width: 0.25, title: 'Average number of words', filters: { is_attachment: [false] }, field: 'words', aggregation: 'avg' },
        {
          type: 'line',
          title: 'Number of messages by team',
          x: { label: 'Date', field: 'date', period: { months: 1, days: 15 }, tick: { days: 1 }, format: 'D MMM' },
          y: { label: 'Number of messages', field: '_uid', aggregation: 'value_count' },
          split: { field: 'team' }
        },
        {
          type: 'area',
          title: 'Number of messages stacked by application version',
          stacked: true,
          x: { label: 'Date', field: 'date', period: { months: 1, days: 15 }, tick: { days: 1 }, format: 'D MMM' },
          y: { label: 'Number of messages', field: '_uid', aggregation: 'value_count' },
          split: { field: 'application.version' }
        },
        {
          type: 'column',
          width: 0.5,
          title: 'Messages per hour',
          stacked: true,
          x: { label: 'Hours', field: 'date_hour', categories: 'hours' },
          y: { label: 'Number of messages', field: '_uid', aggregation: 'value_count' },
          split: { field: 'is_attachment' }
        },
        {
          type: 'column',
          width: 0.5,
          title: 'Messages per weekday',
          x: { label: 'Weekdays', field: 'date_weekday', categories: 'weekdays' },
          y: { label: 'Number of messages', field: '_uid', aggregation: 'value_count' },
          split: { field: 'is_attachment' }
        },
        { type: 'pie', width: 0.5, title: 'OS distribution', field: 'os.name' },
        { type: 'pie', width: 0.5, title: 'Browser distribution', field: 'browser.name' },
        { type: 'pie', width: 0.5, title: 'Team distribution', field: 'team' },
        { type: 'pie', width: 0.5, title: 'Chan vs One-to-one', field: 'is_chan' },
        { type: 'pie', width: 0.5, title: 'Chan most used', field: 'chan' }
      ]
    },
    error: {
      definition: {
        team: { type: 'keyword' },
        date: { type: 'date' },
        date_hour: { type: 'keyword', default: getHour.bind(null, 'date') },
        date_day: { type: 'keyword', default: getMonthDay.bind(null, 'date') },
        date_weekday: { type: 'keyword', default: getWeekDay.bind(null, 'date') },
        date_month: { type: 'keyword', default: getMonth.bind(null, 'date') },
        application: clientDefinition.application,
        browser: clientDefinition.browser,
        os: clientDefinition.os,
        device: clientDefinition.device,
        error: {
          type: 'object',
          properties: {
            status: { type: 'keyword' },
            name: { type: 'keyword' },
            message: { type: 'keyword' }
          }
        }
      },
      facets: ['date', 'team', 'error.status', 'error.name', 'application.version', 'application.platform'],
      list: {
        sort: [{ date: { order: 'desc' } }],
        title: 'Error "{{error.name}}" ({{error.status}})',
        description: '{{error.message}}',
        meta: '{{date}}'
      },
      charts: [
        { type: 'pie', width: 0.5, title: 'Type of errors', field: 'error.name' },
        { type: 'pie', width: 0.5, title: 'Team distribution', field: 'team' }
      ]
    },
    authentification: {
      definition: {
        type: { type: 'keyword' },
        team: { type: 'keyword' },
        user: { type: 'keyword' },
        date: { type: 'date' },
        date_hour: { type: 'keyword', default: getHour.bind(null, 'date') },
        date_day: { type: 'keyword', default: getMonthDay.bind(null, 'date') },
        date_weekday: { type: 'keyword', default: getWeekDay.bind(null, 'date') },
        date_month: { type: 'keyword', default: getMonth.bind(null, 'date') },
        application: clientDefinition.application,
        browser: clientDefinition.browser,
        os: clientDefinition.os,
        device: clientDefinition.device,
        double_auth: { type: 'boolean' },
        sms_sent: { type: 'boolean' },
        double_auth_ignored: { type: 'boolean' },
        double_auth_duration: { type: 'integer' },
        email_sent: { type: 'boolean' },
        recover_password_duration: { type: 'integer' }
      },
      facets: ['date', 'team', 'type', 'double_auth', 'application.version', 'application.platform', 'browser.name', 'browser.major', 'browser.engine.name', 'os.name', 'os.version'],
      list: {
        sort: [{ date: { order: 'desc' } }],
        title: 'Auth "{{type}}" from team {{team}}',
        description: 'DrPanda {{application.version}} - {{device.name}} {{os.name}} {{os.version}} - {{browser.name}} {{browser.major}}',
        meta: '{{date}}'
      },
      charts: [
        {
          type: 'area',
          title: 'Number of successful connections by team',
          stacked: true,
          filters: { type: ['success'] },
          x: { label: 'Date', field: 'date', period: { months: 1, days: 15 }, tick: { days: 1 }, format: 'D MMM' },
          y: { label: 'Number of successful connections', field: '_uid', aggregation: 'value_count' },
          split: { field: 'team' }
        },
        { type: 'pie', width: 0.5, title: 'Team distribution', field: 'team' },
        { type: 'pie', width: 0.5, title: 'Type distribution', field: 'type' }
      ]
    }
  },
  elasticsearch: {
    host: 'localhost:9200',
    log: 'info',
    apiVersion: '5.0'
  }
}
