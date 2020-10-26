// Mongodb
const { MongoClient } = require('mongodb')

function getDb(url, dbName) { // get Collection
	return MongoClient.connect(url, { useUnifiedTopology: true })
		.then((client) => {
			const db = client.db(dbName)
			return db
		})
}
function findDocuments(db, document) { // Find some document
	return db
		.then((data) => {
			const collection = data.collection(document)
			return collection.find({}).toArray().then((res) => res)
		})
}
function findDocument(db, document, filter) { // find Document
	// Get the documents collection
	return db
		.then((data) => {
			const collection = data.collection(document)
			return collection.find(filter).toArray().then((res) => res)
		})
}
function insertDocument(db, document, insertdata) {
	// Get the documents collection
	return db
		.then((data) => {
			const collection = data.collection(document)

			return collection.save(insertdata)
				.then((result) => result)
		})
}
function deleteDocument(db, document, condition) { // Delete Document
	return db
		.then((data) => {
			const collection = data.collection(document)
			return collection.deleteOne(condition)
				.then((result) => result)
		})
}
function updateDocument(db, document, condition, newdata) {
	// update Document
	return db
		.then((data) => {
			const collection = data.collection(document)
			return collection.updateOne(condition,
				{ $set: newdata })
				.then((result) => result)
		})
}
exports.updateDocument = updateDocument
exports.deleteDocument = deleteDocument
exports.insertDocument = insertDocument
exports.getDb = getDb
exports.findDocument = findDocument
exports.findDocuments = findDocuments
