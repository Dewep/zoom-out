let encodeState = (data) => {
  try {
    return btoa(unescape(encodeURIComponent(JSON.stringify(data))))
  } catch (e) {
    return ''
  }
}

let decodeState = (data) => {
  try {
    return JSON.parse(decodeURIComponent(escape(atob(data))))
  } catch (e) {
    return {}
  }
}

let getLocationState = () => {
  let hash = window.location.hash
  if (hash && hash.length > 1) {
    return decodeState(hash.slice(1))
  }
  return {}
}

export function getInitialFilters() {
  let location = getLocationState()
  return location.f || {}
}

export function getInitialModel() {
  let location = getLocationState()
  return location.m || null
}

export function getInitialView() {
  let location = getLocationState()
  return location.v || 'list'
}

export function watchStoreForLocation(store) {
  store.subscribe(() => {
    let state = store.getState()
    window.location.hash = encodeState({
      m: state.project.currentModel,
      v: state.project.currentView,
      f: state.filters
    })
  })
}
