const rp = require('request-promise').defaults({ jar: true })
require('should')
const service = require('../service')

const api = 'http://localhost:8080/'
const MIN = 0
const MAX = 1000001
describe('test MongoDBProject in Positive', () => {
	afterEach(() => rp(`${api}destroy`)) // remove session and record
	it('Positive Test Case - register', () => {
		const name = 'newname'
		const options = {
			method: 'POST',
			uri: `${api}register`,
			form: {
				name, // a new user
				password: 'admin',
			},
			json: true,
		}
		return rp(options)
			.then((result) => {
				result.should.eql('success create user!')
				service.deleteUser(name) // remove register data
			})
	})
	it('Positive Test Case - login', () => {
		const options = {
			method: 'POST',
			uri: `${api}login`,
			form: {
				name: 'user2',
				password: 'admin',
			},
			json: true,
		}
		return rp(options)
			.then((result) => {
				console.log(result)
				result.should.eql('Hello user2')
			})
	})
	it('Positive Test Case - start', () => {
		const options = {
			method: 'POST',
			uri: `${api}login`,
			form: {
				name: 'user2',
				password: 'admin',
			},
			json: true,
		}
		return rp(options)
			.then(() => rp(`${api}start`))
			.then((result) => {
				result.should.equal('OK')
			})
	})
	it('Positive Test Case - play all game', () => {
		const options = {
			method: 'POST',
			uri: `${api}login`,
			form: {
				name: 'user2',
				password: 'admin',
			},
			json: true,
		}
		function playgame(min, max) { // Recursive start
			const num = Math.floor((min + max) / 2)
			return rp(`${api}${num}`)
				.then((result) => {
					if (result === 'smaller') {
						return playgame(num, max)
					}
					if (result === 'bigger') {
						return playgame(min, num)
					}
					return result
				})
		}
		return rp(options)
			.then((result) => {
				result.should.equal('Hello user2')
				return rp(`${api}start`)
			})
			.then((result) => {
				result.should.equal('OK')
				return playgame(MIN, MAX)
			})
			.then((result) => {
				result.should.eql('equal')
			})
	})
})

describe('test MongoDBProject in Negtive', () => {
	afterEach(() => rp(`${api}destroy`)) // remove session and record
	it('Negtive Test Case - regist bad format', () => {
		const options = {
			method: 'POST',
			uri: `${api}register`,
			form: {
				name: 'a',
				password: 'a',
			},
			json: true,
		}
		return rp(options)
			.then((result) => {
				result.should.eql('bad format')
			})
	})
	it('Negtive Test Case - login bad format', () => {
		const options = {
			method: 'POST',
			uri: `${api}login`,
			form: {
				name: 'a',
				password: 'a',
			},
			json: true,
		}
		return rp(options)
			.then((result) => {
				result.should.eql('bad format')
			})
	})
	it('Negtive Test Case - registe cloudnt empty', () => {
		const options = {
			method: 'POST',
			uri: `${api}register`,
			form: {
				name: '',
				password: '',
			},
			json: true,
		}
		return rp(options)
			.then((result) => {
				result.should.eql('coldn\'t empty')
			})
	})
	it('Negtive Test Case - login cloudnt empty', () => {
		const options = {
			method: 'POST',
			uri: `${api}login`,
			form: {
				name: '',
				password: '',
			},
			json: true,
		}
		return rp(options)
			.then((result) => {
				result.should.eql('coldn\'t empty')
			})
	})
	it('Negtive Test Case - login account is not exist', () => {
		const options = {
			method: 'POST',
			uri: `${api}login`,
			form: {
				name: 'user99',
				password: '12345',
			},
			json: true,
		}
		return rp(options)
			.then((result) => {
				result.should.eql('account is not exist')
			})
	})
	it('Negtive Test Case - login with wrong password', () => {
		const options = {
			method: 'POST',
			uri: `${api}login`,
			form: {
				name: 'user2',
				password: 'abcdefgh',
			},
			json: true,
		}
		return rp(options)
			.then((result) => {
				result.should.eql('wrong password')
			})
	})
	it('Negtive Test Case - Duplicate ID', () => {
		const options = {
			method: 'POST',
			uri: `${api}register`,
			form: {
				name: 'admin',
				password: 'admin',
			},
			json: true,
		}
		return rp(options)
			.then((result) => {
				result.should.eql('Duplicate ID')
			})
	})
	it('Negtive Test Case - Not logged in', () => rp(`${api}start`)
		.then((result) => {
			result.should.eql('Not logged in')
		}))
})
