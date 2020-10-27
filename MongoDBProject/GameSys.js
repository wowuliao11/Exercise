const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')
const service = require('./service.js')

const urllencodedParser = bodyParser.urlencoded({ extended: false })
const app = express()
const uri = 'mongodb://root:admin@localhost:10086/game?retryWrites=true&w=majority'

MongoClient.connect(uri, { useUnifiedTopology: true })
	.then((client) => {
		const db = client.db('game')
		app.locals.db = db
	})

const MongoStoreIns = new MongoStore({
	db: app.locals.db,
	url: uri,
})

app.use('/', express.static('pages'))

app.use(session({
	secret: 'foo',
	rolling: true,
	saveUninitialized: false,
	resave: false,
	store: MongoStoreIns,
	cookie: {
		maxAge: 1000 * 300,
	},
	autoRemove: 'native',
}))
// ----------------------------------listen-------------------------------------
app.use('/destroy', (request, response) => {
	service.deleteNumber(app.locals.db, request.session.id)
	request.session.destroy()
	response.end('destroy')
})
app.use('/login', urllencodedParser, (request, response) => {
	if (!request.body) return response.sendStatus(400)
	const { name } = request.body
	const { password } = request.body
	if (name === undefined || password === undefined) {
		response.end('data undefined')
	} else if (name === '' || password === '') {
		response.end('coldn\'t empty')
	} else if (name.length < 3 || name.length > 14
		|| password.length < 3 || password.length > 14) {
		response.end('bad format')
	}
	service.findUser(app.locals.db, name)
		.then((result) => {
			if (result === false) {
				response.end('account is not exist')
			}
			return service.judgeLogin(app.locals.db, name, password)
		})
		.then((result) => {
			if (result === false) {
				response.end('wrong password')
			} else {
				request.session.name = name
				response.end(`Hello ${name}`)
			}
		})
		.catch((err) => {
			console.log(err)
		})
	return null
})

app.use('/register', urllencodedParser, (request, response) => {
	if (!request.body) return response.sendStatus(400)
	const { name } = request.body
	const { password } = request.body

	if (name === '' || password === '') {
		response.end('coldn\'t empty')
	} else if (name.length < 3 || name.length > 14
		|| password.length < 3 || password.length > 14) {
		response.end('bad format')
	}

	service.findUser(app.locals.db, name)
		.then((result) => {
			if (result === true) {
				response.end('Duplicate ID')
			} else {
				service.insertUser(app.locals.db, name, password)
					.catch((err) => {
						console.log(err)
					})
				response.end('success create user!')
			}
		})
		.catch((err) => {
			console.log(err)
		})
	return null
})

app.use('/start', (request, response) => {
	const { name } = request.session
	const { id } = request.session
	if (id === undefined || name === undefined) {
		response.end('Not logged in')
	} else {
		const data = Math.floor(Math.random() * 1000000)
		service.insertNumber(app.locals.db, data, id)
			.catch((err) => {
				console.log(err)
			})
		console.log(`randnum is:${data}`)
		response.end('OK')
	}
})

app.use('/:number', (request, response, next) => {
	const { name } = request.session
	const { id } = request.session
	const inputnumber = Number(request.params.number)
	service.getNumber(app.locals.db, id)
		.then((result) => {
			if (id === undefined || name === undefined) {
				response.end('Not logged in')
			} else if (!result) {
				response.end('without start')
			}
			return service.getNumber(app.locals.db, id)
		})
		.then((result) => {
			const r = result
			if (Number.isNaN(inputnumber) || Number.isNaN(r)) {
				response.end('input not a number')
			} else if (inputnumber > r) {
				response.end('bigger')
			} else if (inputnumber < r) {
				response.end('smaller')
			}
			response.end('equal')
		})
		.catch((err) => {
			response.end()
			next(err)
		})
})

app.listen(8080)
