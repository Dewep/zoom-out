module.exports = {
  apiKeys: ['drpanda-key'],
  project: 'drpanda',
  archiver: 'archives',
  models: {
    message: {
      definition: {
        id: { type: 'keyword' },
        team: { type: 'keyword' },
        chan_id: { type: 'keyword' },
        device: {
          type: 'object',
          properties: {
            os: { type: 'keyword', enum: ['android', 'ios', 'windows', 'mac', 'linux', 'other'] },
            version: { type: 'keyword' },
            from_app: { type: 'boolean' },
            app_version: { type: 'keyword' }
          }
        },
        is_admin: { type: 'boolean' },
        date: { type: 'date' },
        is_attachment: { type: 'boolean' },
        with_styles: { type: 'boolean' },
        size: { type: 'integer' },
        words: { type: 'integer' }
      },
      facets: ['date', 'team', 'device.os', 'device.version', 'device.from_app', 'device.app_version', 'is_admin', 'is_attachment', 'with_styles'],
      list: {
        title: 'Message {id} from team {team}',
        description: 'Chan: {chan_id}',
        meta: '{date}'
      },
      charts: [
        { type: 'pie', split: { field: 'device.os' } }
      ]
    }
  },
  elasticsearch: {
    host: 'localhost:9200',
    log: 'info',
    apiVersion: '5.0'
  }
}
