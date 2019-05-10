const redis = require('redis');
const util = require('util');
const redisUrl = 'redis://127.0.0.1:6379';
const client = redis.createClient(redisUrl);
client.get = util.promisify(client.get);


const mongoose = require('mongoose');

const exec = mongoose.Query.prototype.exec;

// Function available to all mongoose queries.
// Set to true is you want the query cached.
mongoose.Query.prototype.cache = function() {
    this._cache = true;
    
    //make it chainable
    return this;
}

mongoose.Query.prototype.exec = async function() {
    if (!this._cache) {
        return exec.apply(this, arguments);
    }

    const key = JSON.stringify(Object.assign({}, this.getQuery(), {
        collection: this.mongooseCollection.name
    }));

    // client.flushall();

    //see if value in redis
    const cachedValue = await client.get(key);
    console.log('cached value', cachedValue);

    if (cachedValue) {
        const doc = JSON.parse(cachedValue);

        //convert json result into a mongoose document. Map through all elements if an array
        return Array.isArray(cachedValue) ?
        doc.map(document => new this.model(document)) :
        new this.model(doc)
    }

    const result = await exec.apply(this, arguments);
    client.set(key, JSON.stringify(result));
    console.log('Mongo yes?');
    // client.flushall();

    return result;
}