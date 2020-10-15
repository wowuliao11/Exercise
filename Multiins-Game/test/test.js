// should
require('should')
// require
const request = require('request')

const api = 'http://localhost:8081/'
describe('test number guess game ', () => {
	it('test page Start', (done) => {
		request(`${api}start`, (err, res, body) => {
			if (err) {
				done(err)
			}
			body.should.eql('OK')
			done()
		})
	})

	it('test page Guess number', (done) => {
		for (let i = 0; i < 100; i += 1) {
			request(`${api}${i}`, (err, res, body) => {
				if (err) {
					done(err)
				}
				// console.log(body);
				body.should.match(/equal|bigger|smaller/)
			})
		}
		done()
	})

	it('test game playing', () => {
		const playing = new Promise((resolve, reject) => {
			function playgame(min, max) { // Recursive start
				const num = Math.floor((min + max) / 2)
				let tempmin = min
				let tempmax = max
				request(`${api}${num}`, (err, res, body) => {
					if (err) {
						reject(err)
					}
					if (body === 'smaller') {
						tempmin = num
						playgame(tempmin, max)
					}
					if (body === 'bigger') {
						tempmax = num
						playgame(min, tempmax)
					}
					if (body === 'equal') {
						console.log(`last guess:${num}`)
						resolve(num)// Recursive start
					}
				})
			}
			playgame(0, 101)
		})
		return playing
	})
})
