const MongodbClient = require('mongodb').MongoClient
const GenericPool = require('generic-pool')

const factory = {

	create() { // create con
		return MongodbClient.connect('mongodb://root:admin@localhost:10086', { useUnifiedTopology: true })
	},
	destroy(client) { // destroy con
		client.close()// close con
	},
}
//
const opts = {
	max: 20, // max con number
	min: 2, // min con number
}

const myPool = GenericPool.createPool(factory, opts)// create pool
module.exports = myPool
