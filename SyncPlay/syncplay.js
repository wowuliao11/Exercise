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
			throw err
		}
		if (body === 'equal') {
			callback(num)
		}
		if (body === 'smaller') {
			return guessRinCallback(num, max, callback)
		}
		if (body === 'bigger') {
			return guessRinCallback(min, num, callback)
		}
		return false
	})
}

function guessRinPromise(min, max) {
	return new Promise((resolve, reject) => {
		const num = Math.floor((min + max) / 2)
		request(`${API}${num}`, (err, res, body) => {
			if (err) {
				reject(err)
			}
			if (body === 'equal') {
				resolve([true, num])
			}
			if (body === 'smaller') {
				resolve([false, num, max])
			}
			if (body === 'bigger') {
				resolve([false, min, num])
			}
		})
	}).then((data) => {
		if (data[0]) {
			return data[1]
		}
		return guessRinPromise(data[1], data[2])
	})
}

async function guessRinSyncandAwaitWhile(minnum, maxnum) {
	let min = minnum
	let max = maxnum
	let flag = true
	while (flag) { // the output of one iteration might be used as the input to another
		const num = Math.floor((min + max) / 2)
		// eslint-disable-next-line no-await-in-loop
		const body = await rp(`${API}${num}`)
		if (body === 'equal') {
			flag = false
			return num
		}
		if (body === 'smaller') {
			min = num
		}
		if (body === 'bigger') {
			max = num
		}
	}
	return false
}
async function guessRinSyncandAwaitRecursion(minnum, maxnum) {
	let min = minnum
	let max = maxnum
	const num = Math.floor((min + max) / 2)
	const body = await rp(`${API}${num}`)
	if (body === 'equal') {
		return num
	}
	if (body === 'smaller') {
		min = num
		return guessRinSyncandAwaitRecursion(min, max)
	}
	if (body === 'bigger') {
		max = num
		return guessRinSyncandAwaitRecursion(min, max)
	}

	return false
}

async function test() {
	await console.log(`AsynandAwait use while way: ${await guessRinSyncandAwaitWhile(MIN, MAX)}`)
	await console.log(`AsynandAwait use recursion way: ${await guessRinSyncandAwaitRecursion(MIN, MAX)}`)
	await guessRinCallback(MIN, MAX, (result) => {
		console.log(`callback way: ${result}`)
	})
	guessRinPromise(MIN, MAX).then((result) => {
		console.log(`promise way: ${result}`)
	})
}
test()
