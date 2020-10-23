// Mongodb
const { MongoClient } = require('mongodb')

const getDb = function getDb(url, dbName) { // get Collection
	return new Promise((resolve, reject) => {
		MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
			if (err) {
				client.close()
				reject(err)
			}

			const db = client.db(dbName)
			resolve({ db, client })
		})
	})
}
const findDocuments = function findDocuments(db, document) { // Find some document
	return new Promise((resolve, reject) => db
		.then((data) => {
			const collection = data.db.collection(document)
			collection.find({}).toArray((err, docs) => {
				if (err) {
					reject(err)
				}

				data.client.close()
				resolve(docs)
			})
		}))
}
const findDocument = function findDocument(db, document, filter) { // find Document
	// Get the documents collection
	return new Promise((resolve, reject) => db
		.then((data) => {
			const collection = data.db.collection(document)
			collection.find(filter).toArray((err, docs) => {
				if (err) {
					reject(err)
				}

				data.client.close()
				resolve(docs)
			})
		}))
}
const insertDocument = function insertDocument(db, document, insertdata) {
	// Get the documents collection
	return new Promise((resolve, reject) => db
		.then((data) => {
			const collection = data.db.collection(document)

			collection.insertMany([insertdata,
			], (err, result) => {
				if (err) {
					reject(err)
				}

				data.client.close()
				resolve(result)
			})
		}))
}
const deleteDocument = function deleteDocument(db, document, condition) { // Delete Document
	return new Promise((resolve, reject) => db
		.then((data) => {
			const collection = data.db.collection(document)
			collection.deleteOne(condition, (err, result) => {
				if (err) {
					reject(err)
				}

				data.client.close()
				resolve(result)
			})
		}))
}
const updateDocument = function updateDocument(db, document, condition, newdata) {
	// update Document
	return new Promise((resolve, reject) => db
		.then((data) => {
			const collection = data.db.collection(document)
			collection.updateOne(condition,
				{ $set: newdata }, (err, result) => {
					if (err) {
						reject(err)
					}

					data.client.close()
					resolve(result)
				})
		}))
}
exports.updateDocument = updateDocument
exports.deleteDocument = deleteDocument
exports.insertDocument = insertDocument
exports.getDb = getDb
exports.findDocument = findDocument
exports.findDocuments = findDocuments
