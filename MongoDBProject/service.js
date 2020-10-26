const uri = 'mongodb://root:admin@localhost:10086?retryWrites=true&w=majority'
const md5 = require('md5-node')
const dao = require('./dao')

const insertUser = function (name, password) { // insert a User
	if (name === null || password === null) throw new Error('wrong input')

	const randomnum = Math.floor(Math.random() * 10000000)
	const ciphertext = md5(name + randomnum + password)
	dao.insertDocument(dao.getDb(uri, 'game'), 'user', { name, randomnum, ciphertext })
		.then((result) => {
			console.log(result)
		})
}
const findUser = function findUser(name) { // find user if live
	if (name === null) throw new Error('wrong input')

	return dao.findDocument(dao.getDb(uri, 'game'), 'user', { name })
		.then((result) => {
			if (!result.length) return false
			return true
		})
}
const findNumber = function findNumber(_id) { // find number if live filter is _id
	if (_id === null) throw new Error('wrong input')

	return dao.findDocument(dao.getDb(uri, 'game'), 'number', { _id })
		.then((result) => {
			console.log(`_id:      ${_id}     ${JSON.stringify(result)}`)
			if (!result.length) return false
			return true
		})
}
const getNumber = function getNumber(_id) { // get number in Number filter is _id
	if (_id === null) throw new Error('wrong input')

	return dao.findDocument(dao.getDb(uri, 'game'), 'number', { _id })
		.then((result) => (result[0] ? result[0].number : null))
}
const judgeLogin = function judgeLogin(name, password) { // judge longin infomation
	if (findUser(name) === false) throw new Error('wrong input')

	return dao.findDocument(dao.getDb(uri, 'game'), 'user', { name })
		.then((result) => result[0].password === md5(name + result[0].salt + password))
}
const insertNumber = function insertNumber(number, _id) { // insert number
	if (number === null || _id === null) throw new Error('wrong input')

	return dao.insertDocument(dao.getDb(uri, 'game'), 'number', { _id, number })
		.then((result) => {
			console.log(result)
		})
}
const deleteNumber = function deleteNumber(_id) { // delete number
	if (_id === null) throw new Error('wrong input')

	dao.findDocument(dao.getDb(uri, 'game'), 'number', { _id })
		.then((result) => {
			if (!result.length) {
				throw new Error('isnt this user\'s number')
			}
			return dao.deleteDocument(dao.getDb(uri, 'game'), 'number', { _id })
		})
		.then((result) => {
			console.log(result)
		})
}
const updateNumber = function updateNumber(_id, number) { // update number
	if (_id === null || number === null) throw new Error('wrong input')

	dao.updateDocument(dao.getDb(uri, 'game'), 'number', { _id }, { _id, number })
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
