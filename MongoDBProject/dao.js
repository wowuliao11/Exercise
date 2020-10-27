function findDocuments(db, document) { // Find some document
	const collection = db.collection(document)
	return collection.find({}).toArray().then((res) => res)
}
function findDocument(db, document, filter) { // find Document
	// Get the documents collection
	const collection = db.collection(document)
	return collection.find(filter).toArray().then((res) => res)
}
function insertDocument(db, document, insertdata) {
	// Get the documents collection
	const collection = db.collection(document)

	return collection.save(insertdata)
		.then((result) => result)
}
function deleteDocument(db, document, condition) { // Delete Document
	const collection = db.collection(document)
	return collection.deleteOne(condition)
		.then((result) => result)
}
function updateDocument(db, document, condition, newdata) {
	// update Document
	const collection = db.collection(document)
	return collection.updateOne(condition,
		{ $set: newdata })
		.then((result) => result)
}
exports.updateDocument = updateDocument
exports.deleteDocument = deleteDocument
exports.insertDocument = insertDocument
// exports.getDb = getDb
exports.findDocument = findDocument
exports.findDocuments = findDocuments
