const express = require('express')
const http = require('http')

const app = express()
function isNumber(value) {
	const patrn = /^[0-9]*$/
	if (patrn.exec(value) === null || value === '') {
		return false
	}
	return true
}
app.use('/start', (request, response) => {
	response.writeHead(200, { 'Content-Type': 'text/plain' })
	response.end('OK!\n')
	app.set('data', Math.random() * 101)
	console.log(`randnumis${app.get('data')}`)
})

app.get('/number/:number', (req, res) => {
	if (isNumber(req.params.number) && typeof (app.get('data')) !== 'undefined') {
		const { number } = req.params
		const data = Math.floor(parseFloat(app.get('data')))
		if (number < 0 || number > 100) { res.end('out of range') } else if (number > data) { res.end('bigger') } else if (number < data) { res.end('smaller') } else {
			app.set('data', Math.random() * 101)
			console.log(`randnumis${app.get('data')}`)
			res.end('equals! and the num is reset')
		}
	} else { res.end('error operation') }
})
app.use((request, response) => {
	response.writeHead(404, { 'Content-Type': 'text/plain' })
	response.end('404 error!\n')
})

http.createServer(app).listen(1337)
