module.exports = {
  collection: 'conference',

  indexes: [
    { dateday: -1, team: 1 }
  ],

  date: {
    day: true
  },

  definition: {
    team: { type: 'string', facets: true },
    user: { type: 'string' },
    nbMembers: { type: 'integer' },
    duration: { type: 'integer' }
  }
}

// curl -X POST -H "Content-Type: application/json" https://zoom-out.dewep.ovh/api/private/publish/ -H "Authorization: api" -d '{"events":[{"_model":"message","_date":"2020-09-17T23:28:23","team":"root","sender":"dewep","chan":null,"user":"romain","hook":null,"attachmentMimeType":"application/pdf","attachmentSize":1234}]}'
