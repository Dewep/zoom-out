export default {
  encode (obj) {
    const json = JSON.stringify(obj)
    const unicode = encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (match, p1) => String.fromCharCode('0x' + p1))
    const base64 = btoa(unicode)
    const cbase64 = base64.replace(/\+/g, '-').replace(/\//g, '.').replace(/=/g, '_')
    return cbase64
  },

  decode (encodedStr) {
    const base64 = encodedStr.replace(/-/g, '+').replace(/\./g, '/').replace(/_/g, '=')
    const raw = atob(base64)
    const unicode = decodeURIComponent(raw.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))
    const json = JSON.parse(unicode)
    return json
  }
}
