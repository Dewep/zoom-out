function generateError (name, status, initialError) {
  console.warn('[request]', initialError)
  const err = new Error(name)
  err.status = status
  throw err
}

async function requestJson (url, json = null, { headers = {}, authorization = null, method = null, credentials = false } = {}) {
  if (!method) {
    method = json ? 'POST' : 'GET'
  }
  if (!headers.Accept) {
    headers.Accept = 'application/json'
  }
  if (json) {
    headers['Content-Type'] = 'application/json'
  }
  if (authorization) {
    headers.Authorization = authorization
  }

  let response = null

  try {
    response = await window.fetch(url, {
      method,
      headers,
      body: json ? JSON.stringify(json) : undefined,
      credentials: credentials ? 'include' : 'omit'
    })
  } catch (err) {
    return generateError('No internet connection', 0, err)
  }

  let body = null
  try {
    body = await response.json()
  } catch (err) {}

  if (!response.status || response.status < 200 || response.status >= 300) {
    return generateError((body && body.error) || 'Unknown error', response.status, response)
  }

  return body
}

export default {
  request: requestJson,

  get (url, options = {}) {
    return requestJson(url, null, options)
  },

  post (url, data, options = {}) {
    return requestJson(url, data, options)
  }
}
