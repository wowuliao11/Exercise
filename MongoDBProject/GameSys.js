const express = require('express')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const bodyParser = require('body-parser')
const { MongoClient } = require('mongodb')
const Ajv = require('ajv')
const service = require('./service.js')

const ajv = new Ajv({ allErrors: true })

const urllencodedParser = bodyParser.urlencoded({ extended: false })
const app = express()
const uri = 'mongodb://root:admin@localhost:10086/game?retryWrites=true&w=majority'
// -ajv
const schema = {
	properties: {
		name: {
			type: 'string',
			minLength: 3,
			maxLength: 14,
		},
		password: {
			type: 'string',
			minLength: 3,
			maxLength: 14,
		},
	},
}
MongoClient.connect(uri, { useUnifiedTopology: true })
	.then((client) => {
		const db = client.db('game')
		app.locals.db = db
	})
app.use(session({
	secret: 'foo',
	rolling: true,
	saveUninitialized: false,
	resave: false,
	store: new MongoStore({ url: uri }),
	cookie: {
		maxAge: 1000 * 300,
	},
	autoRemove: 'native',
}))
app.use('/', express.static('pages'))

// ----------------------------------listen-------------------------------------
app.use('/destroy', (request, response) => {
	service.deleteNumber(app.locals.db, request.session.id)
	request.session.destroy()
	response.end('destroy')
})
app.use('/login', urllencodedParser, (request, response, next) => {
	if (!request.body) return response.sendStatus(400)
	const { name } = request.body
	const { password } = request.body
	const validate = ajv.compile(schema)

	if (!validate({ name, password })) response.end(`Invalid: ${ajv.errorsText(validate.errors)}`)

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
			next(err)
			console.log(err)
		})
	return null
})

app.use('/register', urllencodedParser, (request, response, next) => {
	if (!request.body) return response.sendStatus(400)
	const { name } = request.body
	const { password } = request.body
	const validate = ajv.compile(schema)

	if (!validate({ name, password })) response.end(`Invalid: ${ajv.errorsText(validate.errors)}`)

	service.findUser(app.locals.db, name)
		.then((result) => {
			if (result === true) {
				response.end('Duplicate ID')
			} else {
				service.insertUser(app.locals.db, name, password)
					.catch((err) => {
						next(err)
						console.log(err)
					})
				response.end('success create user!')
			}
		})
		.catch((err) => {
			next(err)
			console.log(err)
		})
	return null
})

app.use('/start', (request, response, next) => {
	const { name } = request.session
	const { id } = request.session

	if (id === undefined || name === undefined) {
		response.end('Not logged in')
	} else {
		const data = Math.floor(Math.random() * 1000000)
		service.insertNumber(app.locals.db, data, id)
			.catch((err) => {
				next(err)
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
			next(err)
			console.log(err)
		})
})
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).end(`error 500\n${err}`)
})

app.listen(8080)
