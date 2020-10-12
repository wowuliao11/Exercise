// redis
const redis = require('redis')

const client = redis.createClient(6379, 'localhost')

// exprss
const express = require('express')
const http = require('http')
// app1
const app1 = express()

app1.use('/start', (request, response) => {
	response.writeHead(200)
	response.end('OK!\n')
	const data = Math.floor(Math.random() * 100)
	client.set('r', data)
	console.log(`randnum is:${data}`)
})
app1.use('/:number', (req, res) => {
	const number = Number(req.params.number)
	client.get('r', (err, data) => {
		const randnum = Number.parseInt(data, 10)
		// console.log(`here is randnum${randnum} and this is data:${data}`)
		if (err) {
			console.log(err); return false
		} if (Number.isNaN(number) || Number.isNaN(randnum)) {
			res.writeHead(400)
			res.end('400 error!\n')
		} else if (number > randnum) {
			res.writeHead(200)
			res.end('bigger')
		} else if (number < randnum) {
			res.writeHead(200)
			res.end('smaller')
		} else {
			const newrandnum = Math.floor(Math.random() * 100)
			client.set('r', newrandnum)
			// console.log(`randnumis:${newrandnum}`)
			res.writeHead(200)
			res.end('equal')
		}
		res.end(`key:${data}`)
		return true
	})
})

http.createServer(app1).listen(8080)
http.createServer(app1).listen(8081)
