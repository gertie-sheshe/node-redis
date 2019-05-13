const redis = require('redis');
const util = require('util');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);


const mongoose = require('mongoose');

const exec = mongoose.Query.prototype.exec;

// Caching to Redis logic appended to mongoose
// Function available to all mongoose queries.
// Set to true is you want the query cached.
mongoose.Query.prototype.cache = function(options = {}) {
    // Set cache for that query to true
    this._cache = true;

    // Should be of num/string data type
    this._hashKey = JSON.stringify(options.key || 'default');
    
    // Make it chainable
    return this;
}

mongoose.Query.prototype.exec = async function() {
    // Check if query is to be cached
    if (!this._cache) {
        console.log('Ever get here?');
        return exec.apply(this, arguments);
    }


    // Create unique key to store in redis
    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    // client.flushall();

    // See if value is in redis. Fetch by unique key
    const cachedValue = await client.hget(this._hashKey, key);
    console.log('cached value', cachedValue);

    if (cachedValue) {
        const doc = JSON.parse(cachedValue);

        // Convert json result into a mongoose document. Map through all elements if an array
        return Array.isArray(doc) ?
        doc.map(document => new this.model(document)) :
        new this.model(doc)
    }

    const result = await exec.apply(this, arguments);
    client.hset(this._hashKey, key, JSON.stringify(result), 'EX', 10);
    console.log('Mongo yes?');
    // client.flushall();

    return result;
}

module.exports = {
    clearHash(hashKey) {
        client.del(JSON.stringify(hashKey));
    }
};