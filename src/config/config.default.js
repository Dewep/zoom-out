module.exports = {
  apiKeys: {
    'drpanda-key': 'drpanda'
  },
  projects: {
    drpanda: {
      models: {
        message: {
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
        }
      }
    }
  },
  elasticsearch: {
    host: 'localhost:9200',
    log: 'info',
    apiVersion: '5.0'
  }
}
