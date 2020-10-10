const express = require('express')
const http = require('http')

const app = express()
let data
app.use('/start', (request, response) => {
	response.writeHead(200)
	response.end('OK!\n')
	data = Math.floor(Math.random() * 100)
	console.log(`randnumis:${data}`)
})

app.use('/:number', (req, res) => {
	const number = Number(req.params.number)
	if (Number.isNaN(number) || typeof (data) === 'undefined') {
		res.writeHead(400)
		res.end('400 error!\n')
	} else if (number > data) {
		res.writeHead(200)
		res.end('bigger')
	} else if (number < data) {
		res.writeHead(200)
		res.end('smaller')
	} else {
		data = Math.floor(Math.random() * 100)
		console.log(`randnumis:${data}`)
		res.writeHead(200)
		res.end('equal')
	}
})

app.use((req, res) => {
	res.writeHead(404)
	res.end('404 error!\n')
})

http.createServer(app).listen(8080)
