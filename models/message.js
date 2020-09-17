module.exports = {
  collection: 'message',

  indexes: [
    { date: 1 },
    { team: 1, date: 1 }
  ],

  definition: {
    team: { type: 'string', facets: true },
    sender: { type: 'string', nullable: true },
    chan: { type: 'string', nullable: true },
    user: { type: 'string', nullable: true },
    hook: { type: 'string', nullable: true },
    attachmentMimeType: { type: 'string', nullable: true },
    attachmentSize: { type: 'integer', nullable: true }
  }
}

// curl -X POST -H "Content-Type: application/json" https://zoom-out.dewep.ovh/api/private/publish/ -H "Authorization: api" -d '{"events":[{"_model":"message","_date":"2020-09-17T23:28:23","team":"root","sender":"dewep","chan":null,"user":"romain","hook":null,"attachmentMimeType":"application/pdf","attachmentSize":1234}]}'
