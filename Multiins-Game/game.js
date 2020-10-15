// redis
const redis = require('redis')

const client = redis.createClient(6379, 'localhost')

// exprss
const express = require('express')
const http = require('http')
// app
const app = express()
// httperror  ---temp
const creatError = require('http-errors')

app.use('/start', (request, response) => {
	response.writeHead(200)
	response.end('OK')
	const data = Math.floor(Math.random() * 100)
	client.set('r', data)
	console.log(`randnum is:${data}`)
})

app.use('/:number', (req, res, next) => {
	const number = Number(req.params.number)
	client.get('r', (err, data) => {
		const randnum = Number(data)
		if (err) {
			next(err)
		} else if (Number.isNaN(number) || Number.isNaN(randnum)) {
			// res.writeHead(400)
			next(creatError(400))
		} else if (number > randnum) {
			res.end('bigger')
		} else if (number < randnum) {
			res.end('smaller')
		} else {
			const newrandnum = Math.floor(Math.random() * 100)
			client.set('r', newrandnum)
			res.end('equal')
		}
		res.end(`key:${data}`)
		return true
	})
})

app.use((err, req, res) => {
	res.end(`Error Infomation:${err.status}`)
})
http.createServer(app).listen(process.argv[2])
