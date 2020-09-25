const jsonwebtoken = require('jsonwebtoken')
const config = require.main.require('./config')

class JWT {
  async sign (payload, expiration = null) {
    const options = {}
    if (expiration) {
      options.expiresIn = expiration
    }

    return new Promise(function (resolve, reject) {
      jsonwebtoken.sign(payload, config.jwtFront, options, function (err, token) {
        if (err) {
          reject(err)
        } else {
          resolve(token)
        }
      })
    })
  }

  async verify (payload) {
    return new Promise(function (resolve, reject) {
      jsonwebtoken.verify(payload, config.jwtFront, function (err, data) {
        if (err) {
          reject(new Error('L\'identifiant de clé JWT est invalide ou expiré.'))
        } else {
          resolve(data)
        }
      })
    })
  }
}

module.exports = new JWT()
