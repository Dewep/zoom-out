const https = require('https')
const { DateTime } = require('luxon')

const options = {
  host: 'zoom-out.dewep.ovh',
  path: '/api/private/publish/',
  method: 'POST',
  headers: {
    'content-type': 'application/json',
    authorization: 'api'
  }
}

async function send (events) {
  const req = https.request(options)
  req.write(JSON.stringify({ events }))
  req.end()
  await new Promise(resolve => setTimeout(resolve, 200))
}

function rand (max, min = 1) {
  if (Array.isArray(max)) {
    return max[Math.floor(Math.random() * max.length)]
  }
  return Math.floor(min + Math.random() * (max - min))
}

const teams = ['root', 'icl', 'silver', 'gentilly']
const users = ['dewep', 'romain', 'er3tic', 'pj', 'aurelien', 'christmas', 'lena', 'hhugo', 'nathan', 'axel', 'robin']

async function main () {
  let date = DateTime.local(2019, 9, 19, 8, 30)
  const now = DateTime.local()
  let events = []

  while (date < now) {
    events.push({
      _model: 'conference',
      _date: date.toISO(),
      team: rand(teams),
      user: rand(users),
      nbMembers: rand(10),
      duration: rand(120)
    })

    date = date.plus({ minutes: rand(60) })

    if (events.length > 100) {
      await send(events)
      events = []
    }
  }

  await send(events)
}

main().catch(console.error)
