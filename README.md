# Zoom Out

Event processing project

## Requirements / installation / builds

Node (>= 6.x) + npm (`npm install`).

Build web: `npm run build` (`npm run watch` for JSX watch mode).

Start the server: `npm start`.

## Configuration file (`server/config/config.local.js`)

See example config file here: `server/config/config.example.js`.

- `apiKeys`: API keys for push and queries events
- `project`: project name
- `archiver`: directory for the archives (the directory must be existed - set to `null` to not archive the events pushed)
- `models`: list of models
- `models.XYZ.definition`: defintion of the model (types available: 'boolean', 'date', 'ip', 'keyword', 'byte', 'short', 'integer', 'long', 'double', 'object')
- `models.XYZ.facets`: array of fields for the facets (filters present in the sidebar)
- `models.XYZ.list`: template for the list mode properties
- `models.XYZ.charts`: list of charts

### Charts

General configuration:

- `type`: type of the chart
- `width`: width ratio (between 0 and 1 - default to 1)

Charts available:

- `pie`: you must provide a `field` property

## API routes

You must provide an `Authorization` key to use the APi routes (defined in the `apiKeys` property in the config file).

- POST /api/models/:model_name/database/ : create index for the model `:model_name` into the ElasticSearch database
- DELETE /api/models/:model_name/database/ : delete the index for the model `:model_name` in the ElasticSearch database
- POST /api/models/:model_name/push/ `{...}` : push a new event for the model `:model_name`
- POST /api/models/:model_name/query/facets/ `{filters: [...]}` : get facets information
- POST /api/models/:model_name/query/list/ `{filters: [...], page: 2}` : get events
- POST /api/models/:model_name/query/aggregations/ `{filters: [...], filterExclude: null, aggregations: {...}}` : create ElasticSearch aggregations

## Getting started

- `cp server/config/config.example.js server/config/config.local.js` (+ edit the configuration for your needs)
- `npm install` + `npm run build` + `npm start`
- Push your events: `curl -XPOST http://127.0.0.1:3000/api/models/message/push -H 'Authorization: my-api-key' -H 'Content-type: application/json' -d@data/my_message_event.json`
- Go on `http://127.0.0.1:3000`

## Systemctl service example

```
# /etc/systemd/system/zoom-out-drpanda.service

[Service]
ExecStart=/usr/bin/node /home/zoom-out-drpanda/server/app.js
Restart=always
RestartSec=10
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=zoom-out-drpanda
User=root
Group=root
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

## ElasticSearch (docker example in dev mode)

```sh
$> docker run -d -p 9200:9200 -e "http.host=0.0.0.0" -e "transport.host=127.0.0.1" docker.elastic.co/elasticsearch/elasticsearch:5.2.1
```
