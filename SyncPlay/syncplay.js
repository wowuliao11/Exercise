// request
const request = require('request')
// request-promise
const rp = require('request-promise')
// min is 0 ,max is 1000000
const MIN = 0
const MAX = 1000001
const API = 'http://localhost:8081/'

function guessRinCallback(min, max, callback) {
	const num = Math.floor((max + min) / 2)
	request(`${API}${num}`, (err, res, body) => {
		if (err) {
			callback(err)
		}
		if (body === 'equal') {
			callback(null, num)
		}
		if (body === 'smaller') {
			guessRinCallback(num, max, callback)
		}
		if (body === 'bigger') {
			guessRinCallback(min, num, callback)
		}
	})
}

function guessRinPromise(min, max) {
	const num = Math.floor((min + max) / 2)
	return rp(`${API}${num}`)
		.then((response) => {
			if (response === 'bigger') {
				return guessRinPromise(min, num)
			}
			if (response === 'smaller') {
				return guessRinPromise(num, max)
			}
			return num
		})
}

async function guessRinSyncandAwaitWhile(minnum, maxnum) {
	let min = minnum
	let max = maxnum

	while (true) { // the output of one iteration might be used as the input to another
		const num = Math.floor((min + max) / 2)
		// eslint-disable-next-line no-await-in-loop
		const response = await rp(`${API}${num}`)
		if (response === 'equal') {
			return num
		}
		if (response === 'smaller') {
			min = num
		}
		if (response === 'bigger') {
			max = num
		}
	}
}
async function guessRinSyncandAwaitRecursion(minnum, maxnum) {
	let min = minnum
	let max = maxnum
	const num = Math.floor((min + max) / 2)
	const response = await rp(`${API}${num}`)

	if (response === 'smaller') {
		min = num
		return guessRinSyncandAwaitRecursion(min, max)
	}
	if (response === 'bigger') {
		max = num
		return guessRinSyncandAwaitRecursion(min, max)
	}
	return num
}

async function test() {
	console.log(`AsynandAwait use while way: ${await guessRinSyncandAwaitWhile(MIN, MAX)}`)
	console.log(`AsynandAwait use recursion way: ${await guessRinSyncandAwaitRecursion(MIN, MAX)}`)
	guessRinCallback(MIN, MAX, (err, result) => {
		if (err) {
			console.error(err)
		} else {
			console.log(`AsynandAwait use callback way: ${result}`)
		}
	})
	guessRinPromise(MIN, MAX)
		.then((result) => {
			console.log(`AsynandAwait use promise way:${result}`)
		})
		.catch((err) => {
			console.error(err)
		})
}
test()
