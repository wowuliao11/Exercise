const uri = 'mongodb://root:admin@localhost:10086?retryWrites=true&w=majority'
const md5 = require('md5-node')
const dao = require('./dao')

const insertUser = function (name, password) { // insert a User
	const randomnum = Math.floor(Math.random() * 10000000)
	const ciphertext = md5(name + randomnum + password)
	dao.insertDocument(dao.getDb(uri, 'game'), 'user', { name, randomnum, ciphertext })
		.then((result) => {
			console.log(result)
		})
}
const findUser = function findUser(name) { // find user if live
	return dao.findDocument(dao.getDb(uri, 'game'), 'user', { name })
		.then((result) => {
			if (JSON.stringify(result) === '[]') return false
			return true
		})
}
const findNumber = function findNumber(userid) { // find number if live filter is userid
	return dao.findDocument(dao.getDb(uri, 'game'), 'number', { userid })
		.then((result) => {
			if (JSON.stringify(result) === '[]') return false
			return true
		})
}
const getNumber = function getNumber(userid) { // get number in Number filter is userid
	return dao.findDocument(dao.getDb(uri, 'game'), 'number', { userid })
		.then((result) => {
			if (result[0] !== undefined) return result[0].number
			return null
		})
}
const judgeLogin = function judgeLogin(name, password) { // judge longin infomation
	if (findUser(name) === false) {
		return null
	}
	return dao.findDocument(dao.getDb(uri, 'game'), 'user', { name })
		.then((result) => {
			if (result[0].password === md5(name + result[0].salt + password)) return true
			return false
		})
}
const insertNumber = function insertNumber(number, userid) { // insert number
	if (number === null || userid === null) {
		return null
	}
	return dao.insertDocument(dao.getDb(uri, 'game'), 'number', { userid, number })
		.then((result) => {
			console.log(result)
		})
}
const deleteNumber = function deleteNumber(userid) { // delete number
	dao.findDocument(dao.getDb(uri, 'game'), 'number', { userid })
		.then((result) => {
			if (JSON.stringify(result) === '[]') {
				console.log('isnt this user\'s number')
				return null
			}
			return dao.deleteDocument(dao.getDb(uri, 'game'), 'number', { userid })
		})
		.then((result) => {
			console.log(result)
		})
}
const updateNumber = function updateNumber(userid, number) { // update number
	dao.updateDocument(dao.getDb(uri, 'game'), 'number', { userid }, { userid, number })
		.then(() => {
			console.log('success updatenumber')
		})
}
exports.getNumber = getNumber
exports.updateNumber = updateNumber
exports.deleteNumber = deleteNumber
exports.insertNumber = insertNumber
exports.findNumber = findNumber
exports.insertUser = insertUser
exports.findUser = findUser
exports.judgeLogin = judgeLogin
