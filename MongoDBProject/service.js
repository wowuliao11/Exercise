const md5 = require('md5-node')
const dao = require('./dao')
const dbpool = require('./dbpool')

// const db = dao.getDb(uri, 'game')

function insertUser(name, password) { // insert a User
	if (name === null || password === null) throw new Error('wrong input')

	const resoursePro = dbpool.acquire()
	resoursePro.then((client) => {
		const salt = Math.floor(Math.random() * 10000000)
		const ciphertext = md5(name + salt + password)
		dao.insertDocument(client.db('game'), 'user', { name, salt, password: ciphertext })
			.then((result) => {
				console.log(result)
				dbpool.release(client)
			})
			.catch((err) => {
				console.log(err)
				dbpool.release(client)
			})
	})
}

function findUser(name) { // find user if live
	if (name === null) throw new Error('wrong input')

	const resoursePro = dbpool.acquire()
	return resoursePro.then((client) => dao.findDocument(client.db('game'), 'user', { name })
		.then((result) => {
			dbpool.release(client)
			return !!result.length
		})
		.catch((err) => {
			dbpool.release(client)
			console.log(err)
		}))
}
function findNumber(_id) { // find number if live filter is _id
	if (_id === null) throw new Error('wrong input')

	const resoursePro = dbpool.acquire()
	return resoursePro.then((client) => dao.findDocument(client.db('game'), 'number', { _id })
		.then((result) => {
			dbpool.release(client)
			return !!result.length
		})
		.catch((err) => {
			dbpool.release(client)
			console.log(err)
		}))
}
function getNumber(_id) { // get number in Number filter is _id
	if (_id === null) throw new Error('wrong input')

	const resoursePro = dbpool.acquire()
	return resoursePro.then((client) => dao.findDocument(client.db('game'), 'number', { _id })
		.then((result) => {
			dbpool.release(client)
			return result[0] ? result[0].number : null
		})
		.catch((err) => {
			dbpool.release(client)
			console.log(err)
		}))
}
function judgeLogin(name, password) { // judge longin infomation
	if (findUser(name) === false) throw new Error('wrong input')

	const resoursePro = dbpool.acquire()
	return resoursePro.then((client) => dao.findDocument(client.db('game'), 'user', { name })
		.then((result) => {
			dbpool.release(client)
			return result[0].password === md5(name + result[0].salt + password)
		})
		.catch((err) => {
			dbpool.release(client)
			console.log(err)
		}))
}
function insertNumber(number, _id) { // insert number
	if (number === null || _id === null) throw new Error('wrong input')

	const resoursePro = dbpool.acquire()
	return resoursePro.then((client) => dao.insertDocument(client.db('game'), 'number', { _id, number })
		.then((result) => {
			dbpool.release(client)
			console.log(result)
		})
		.catch((err) => {
			dbpool.release(client)
			console.log(err)
		}))
}
function deleteNumber(_id) { // delete number
	if (_id === null) throw new Error('wrong input')

	const resoursePro = dbpool.acquire()
	return resoursePro.then((client) => {
		dao.findDocument(client.db('game'), 'number', { _id })
			.then((result) => {
				if (!result.length) {
					throw new Error('isnt this user\'s number')
				}
				return dao.deleteDocument(client.db('game'), 'number', { _id })
			})
			.then((result) => {
				dbpool.release(client)
				console.log(result)
			})
			.catch((err) => {
				dbpool.release(client)
				console.log(err)
			})
	})
}
function deleteUser(name) { // delete number
	if (name === null) throw new Error('wrong input')

	const resoursePro = dbpool.acquire()
	return resoursePro.then((client) => {
		dao.findDocument(client.db('game'), 'user', { name })
			.then((result) => {
				if (!result.length) {
					throw new Error('isnt this user\'s user')
				}
				return dao.deleteDocument(client.db('game'), 'user', { name })
			})
			.then((result) => {
				dbpool.release(client)
				console.log(result)
			})
			.catch((err) => {
				dbpool.release(client)
				console.log(err)
			})
	})
}
function updateNumber(_id, number) { // update number
	if (_id === null || number === null) throw new Error('wrong input')

	const resoursePro = dbpool.acquire()
	return resoursePro.then((client) => {
		dao.updateDocument(client.db('game'), 'number', { _id }, { _id, number })
			.then(() => {
				dbpool.release(client)
				console.log('success updatenumber')
			})
			.catch((err) => {
				dbpool.release(client)
				console.log(err)
			})
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
