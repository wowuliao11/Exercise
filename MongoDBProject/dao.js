// Mongodb
const { MongoClient } = require('mongodb')

const getDb = function getDb(url, dbName) { // get Collection
	return MongoClient.connect(url, { useUnifiedTopology: true })
		.then((client) => {
			const db = client.db(dbName)
			return { db, client }
		})
		.catch((err) => { console.log(err) })
}
const findDocuments = function findDocuments(db, document) { // Find some document
	return db
		.then((data) => {
			const collection = data.db.collection(document)
			return collection.find({}).toArray().then((res) => {
				data.client.close()
				return res
			})
				.catch((err) => { console.log(err) })
		})
}
const findDocument = function findDocument(db, document, filter) { // find Document
	// Get the documents collection
	return db
		.then((data) => {
			const collection = data.db.collection(document)
			return collection.find(filter).toArray().then((res) => {
				data.client.close()
				return res
			})
				.catch((err) => { console.log(err) })
		})
}
const insertDocument = function insertDocument(db, document, insertdata) {
	// Get the documents collection
	return db
		.then((data) => {
			const collection = data.db.collection(document)

			return collection.save(insertdata)
				.then((result) => {
					data.client.close()
					return result
				})
				.catch((err) => { console.log(err) })
		})
}
const deleteDocument = function deleteDocument(db, document, condition) { // Delete Document
	return db
		.then((data) => {
			const collection = data.db.collection(document)
			return collection.deleteOne(condition)
				.then((result) => {
					data.client.close()
					return result
				})
				.catch((err) => { console.log(err) })
		})
}
const updateDocument = function updateDocument(db, document, condition, newdata) {
	// update Document
	return db
		.then((data) => {
			const collection = data.db.collection(document)
			return collection.updateOne(condition,
				{ $set: newdata })
				.then((result) => {
					data.client.close()
					return result
				})
				.catch((err) => { console.log(err) })
		})
}
exports.updateDocument = updateDocument
exports.deleteDocument = deleteDocument
exports.insertDocument = insertDocument
exports.getDb = getDb
exports.findDocument = findDocument
exports.findDocuments = findDocuments
