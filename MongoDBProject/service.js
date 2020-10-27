const md5 = require('md5-node')
const dao = require('./dao')

// const db = dao.getDb(uri, 'game')

// const resoursePro = dbpool.acquire()
function insertUser(db, name, password) { // insert a User
	if (name === null || password === null) throw new Error('wrong input')

	const salt = Math.floor(Math.random() * 10000000)
	const ciphertext = md5(name + salt + password)
	dao.insertDocument(db, 'user', { name, salt, password: ciphertext })
		.then((result) => {
			console.log(result)
		})
		.catch((err) => {
			console.log(err)
		})
}

function findUser(db, name) { // find user if live
	if (name === null) throw new Error('wrong input')

	return dao.findDocument(db, 'user', { name })
		.then((result) => !!result.length)
		.catch((err) => {
			console.log(err)
		})
}
function findNumber(db, _id) { // find number if live filter is _id
	if (_id === null) throw new Error('wrong input')

	return dao.findDocument(db, 'number', { _id })
		.then((result) => !!result.length)
		.catch((err) => {
			console.log(err)
		})
}
function getNumber(db, _id) { // get number in Number filter is _id
	if (_id === null) throw new Error('wrong input')

	return dao.findDocument(db, 'number', { _id })
		.then((result) => (result[0] ? result[0].number : null))
		.catch((err) => {
			console.log(err)
		})
}
function judgeLogin(db, name, password) { // judge longin infomation
	if (findUser(db, name) === false) throw new Error('wrong input')

	return dao.findDocument(db, 'user', { name })
		.then((result) => result[0].password === md5(name + result[0].salt + password))
		.catch((err) => {
			console.log(err)
		})
}
function insertNumber(db, number, _id) { // insert number
	if (number === null || _id === null) throw new Error('wrong input')

	return dao.insertDocument(db, 'number', { _id, number })
		.then((result) => {
			console.log(result)
		})
		.catch((err) => {
			console.log(err)
		})
}
function deleteNumber(db, _id) { // delete number
	if (_id === null) throw new Error('wrong input')

	dao.findDocument(db, 'number', { _id })
		.then((result) => {
			if (!result.length) {
				throw new Error('isnt this user\'s number')
			}
			return dao.deleteDocument(db, 'number', { _id })
		})
		.then((result) => {
			console.log(result)
		})
		.catch((err) => {
			console.log(err)
		})
}
function deleteUser(db, name) { // delete number
	if (name === null) throw new Error('wrong input')

	dao.findDocument(db, 'user', { name })
		.then((result) => {
			if (!result.length) {
				throw new Error('isnt this user\'s user')
			}
			return dao.deleteDocument(db, 'user', { name })
		})
		.then((result) => {
			console.log(result)
		})
		.catch((err) => {
			console.log(err)
		})
}
function updateNumber(db, _id, number) { // update number
	if (_id === null || number === null) throw new Error('wrong input')

	dao.updateDocument(db, 'number', { _id }, { _id, number })
		.then(() => {
			console.log('success updatenumber')
		})
		.catch((err) => {
			console.log(err)
		})
}

exports.getNumber = getNumber
exports.updateNumber = updateNumber
exports.deleteNumber = deleteNumber
exports.deleteUser = deleteUser
exports.insertNumber = insertNumber
exports.findNumber = findNumber
exports.insertUser = insertUser
exports.findUser = findUser
exports.judgeLogin = judgeLogin
