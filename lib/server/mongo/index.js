const { MongoClient, ObjectID } = require('mongodb')
const config = require.main.require('./config')

class Mongo {
  async client () {
    if (!this._clientPromise) {
      const url = `mongodb://${config.mongo.host}:${config.mongo.port}/${config.mongo.database}`
      this._clientPromise = MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    }

    return this._clientPromise
  }

  async db () {
    if (!this._dbPromise) {
      this._dbPromise = this.client().then(client => client.db())
    }

    return this._dbPromise
  }

  async collection (collectionName) {
    const db = await this.db()
    return db.collection(collectionName)
  }

  async close () {
    if (this._clientPromise) {
      const client = await this.client()
      client.close()
    }

    this._clientPromise = null
    this._dbPromise = null
  }

  formatID (id) {
    return ObjectID(id)
  }

  async _catchError (error) {
    console.error(error, {
      tags: { type: 'mongodb' }
    })

    this.close()

    throw error
  }

  /**
   * Execute an action on the client instance (or the collection), with a catch on DB errors
   *
   * @param {String} [collectionName] Collection name.
   * @param {object} [action] Async function for the action.
   */
  async custom (collectionName = null, action) {
    try {
      const client = await (collectionName ? this.collection(collectionName) : this.db())
      return action(client)
    } catch (err) {
      this.close()
      throw err
    }
  }

  /**
   * Execute an aggregation framework pipeline against the collection
   *
   * @see http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#aggregate
   *
   * @param {String} [collectionName] Collection name.
   * @param {object} [pipeline=[]] Array containing all the aggregation framework commands for the execution.
   * @param {object} [options] Optional settings.
   */
  async aggregate (collectionName, pipeline, options) {
    return this.custom(collectionName, collection => {
      return collection.aggregate(pipeline, options)
        .toArray()
    })
  }

  /**
   * Perform a bulkWrite operation without a fluent API
   *
   * Legal operation types are
   *
   *  { insertOne: { document: { a: 1 } } }
   *
   *  { updateOne: { filter: {a:2}, update: {$set: {a:2}}, upsert:true } }
   *
   *  { updateMany: { filter: {a:2}, update: {$set: {a:2}}, upsert:true } }
   *
   *  { deleteOne: { filter: {c:1} } }
   *
   *  { deleteMany: { filter: {c:1} } }
   *
   *  { replaceOne: { filter: {c:3}, replacement: {c:4}, upsert:true}}
   *
   * If documents passed in do not contain the **_id** field,
   * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
   * can be overridden by setting the **forceServerObjectId** flag.
   *
   * @see http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#bulkWrite
   *
   * @param {String} [collectionName] Collection name.
   * @param {object[]} operations Bulk operations to perform.
   * @param {object} [options] Optional settings.
   */
  async bulkWrite (collectionName, operations, options) {
    return this.custom(collectionName, collection => {
      return collection.bulkWrite(operations, options)
    })
  }

  /**
   * Gets the number of documents matching the filter.
   *
   * @see http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#countDocuments
   *
   * @param {String} [collectionName] Collection name.
   * @param {object} [query] the query for the count
   * @param {object} [options] Optional settings.
   */
  async count (collectionName, query, options) {
    return this.custom(collectionName, collection => {
      return collection.countDocuments(query, options)
    })
  }

  /**
   * Delete multiple documents from a collection
   *
   * @see http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#deleteMany
   *
   * @param {String} [collectionName] Collection name.
   * @param {object} [filter] The Filter used to select the documents to remove
   * @param {object} [options] Optional settings.
   */
  async deleteMany (collectionName, filter, options) {
    return this.custom(collectionName, collection => {
      return collection.deleteMany(filter, options)
        .then(result => result.result)
    })
  }

  /**
   * Delete a document from a collection
   *
   * @see http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#deleteOne
   *
   * @param {String} [collectionName] Collection name.
   * @param {object} [filter] The Filter used to select the document to remove
   * @param {object} [options] Optional settings.
   */
  async deleteOne (collectionName, filter, options) {
    return this.custom(collectionName, collection => {
      return collection.deleteOne(filter, options)
        .then(result => result.result)
    })
  }

  /**
   * Ensures that an index exists, if it does not it creates it
   *
   * @see http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#ensureIndex
   *
   * @param {String} [collectionName] Collection name.
   * @param {object} [fieldOrSpec] Defines the index.
   * @param {object} [options] Optional settings.
   */
  async createIndex (collectionName, fieldOrSpec, options) {
    return this.custom(collectionName, collection => {
      return collection.createIndex(fieldOrSpec, options)
    })
  }

  /**
   * Find documents, return an array
   *
   * @see http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#find
   *
   * @param {String} [collectionName] Collection name.
   * @param {object} [query] The cursor query object.
   * @param {object} [options] Optional settings.
   * @param {number} [options.limit=0] Sets the limit of documents returned in the query.
   * @param {(array|object)} [options.sort] Set to sort the documents coming back from the query. Array of indexes, [['a', 1]] etc.
   * @param {object} [options.projection] The fields to return in the query. Object of fields to include or exclude (not both), {'a':1}
   * @param {number} [options.skip=0] Set to skip N documents ahead in your query (useful for pagination).
   * @param {number} [options.min] Set index bounds.
   * @param {number} [options.max] Set index bounds.
   */
  async find (collectionName, query, options) {
    return this.custom(collectionName, collection => {
      const cursor = collection.find(query, options)
      return cursor.toArray()
    })
  }

  /**
   * Fetches the first document that matches the query
   *
   * @see http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#findOne
   *
   * @param {String} [collectionName] Collection name.
   * @param {object} [query] Query for find Operation
   * @param {object} [options] Optional settings.
   */
  async findOne (collectionName, query, options) {
    return this.custom(collectionName, collection => {
      return collection.findOne(query, options)
    })
  }

  /**
   * Fetches the first document that matches the query
   *
   * @see http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#findOne
   *
   * @param {String} [collectionName] Collection name.
   * @param {object} [query] Query for find Operation
   * @param {object} [options] Optional settings.
   */
  async findOneThrow (collectionName, query, options) {
    const result = await this.findOne(collectionName, query, options)
    if (!result) {
      throw new Error(`'${collectionName}' non trouvé`)
    }
    return result
  }

  /**
   * Inserts an array of documents into MongoDB. If documents passed in do not contain the **_id** field,
   * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
   * can be overridden by setting the **forceServerObjectId** flag.
   *
   * @see http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#insertMany
   *
   * @param {String} [collectionName] Collection name.
   * @param {object} [docs] Documents to insert.
   * @param {object} [options] Optional settings.
   */
  async insertMany (collectionName, docs, options) {
    return this.custom(collectionName, collection => {
      return collection.insertMany(docs, options)
    })
  }

  /**
   * Inserts a single document into MongoDB. If documents passed in do not contain the **_id** field,
   * one will be added to each of the documents missing it by the driver, mutating the document. This behavior
   * can be overridden by setting the **forceServerObjectId** flag.
   *
   * @see http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#insertOne
   *
   * @param {String} [collectionName] Collection name.
   * @param {object} [doc] Documents to insert.
   * @param {object} [options] Optional settings.
   */
  async insertOne (collectionName, doc, options) {
    return this.custom(collectionName, collection => {
      return collection.insertOne(doc, options)
        .then(result => result.ops[0])
    })
  }

  /**
   * Update multiple documents in a collection
   *
   * @see http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#updateMany
   *
   * @param {String} [collectionName] Collection name.
   * @param {object} [filter] The Filter used to select the documents to update
   * @param {object} [update] The update operations to be applied to the documents
   * @param {object} [options] Optional settings.
   */
  async updateMany (collectionName, filter, update, options) {
    return this.custom(collectionName, collection => {
      return collection.updateMany(filter, update, options)
        .then(result => result.result)
    })
  }

  /**
   * Update a single document in a collection
   *
   * @see http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#updateOne
   *
   * @param {String} [collectionName] Collection name.
   * @param {object} [filter] The Filter used to select the document to update
   * @param {object} [update] The update operations to be applied to the document
   * @param {object} [options] Optional settings.
   */
  async updateOne (collectionName, filter, update, options) {
    return this.custom(collectionName, collection => {
      return collection.updateOne(filter, update, options)
        .then(result => result.result)
    })
  }

  /**
   * Update the current document by the _id field in a collection
   * Use from team-server
   *
   * @see http://mongodb.github.io/node-mongodb-native/3.2/api/Collection.html#updateOne
   *
   * @param {String} [collectionName] Collection name.
   * @param {object} [update] The update operations to be applied to the document
   * @param {object} [options] Optional settings.
   */
  async update (collectionName, update, options) {
    return this.custom(collectionName, collection => {
      return collection.updateOne({ _id: update._id }, { $set: update }, options)
        .then(result => result.result)
    })
  }
}

module.exports = new Mongo()
