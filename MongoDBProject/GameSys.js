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

function awaitWrap(promise) { // function :handle async await Exception
	return promise
		.then((data) => [null, data])
		.catch((err) => [err, null])
}

const schema = { // -ajv schema
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
MongoClient.connect(uri, { useUnifiedTopology: true }) // express global : db
	.then((client) => {
		const db = client.db('game')
		app.locals.db = db
	})

app.use(session({ // use session
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

// ----------------------------------listen-------------------------------------

app.use('/', express.static('pages')) // config static resources

app.use('/destroy', (request, response) => { // destroy session
	service.deleteNumber(app.locals.db, request.session.id)
	request.session.destroy()
	response.end('destroy')
})
app.use('/login', urllencodedParser, async (request, response, next) => { // judge login
	const { name } = request.body
	const { password } = request.body
	const validate = ajv.compile(schema)

	if (!validate({ name, password })) response.end(`Invalid: ${ajv.errorsText(validate.errors)}`)

	// find user of the name
	const [err, userflag] = await awaitWrap(service.findUser(app.locals.db, name))
	if (err) next(err)
	if (userflag === false) response.end('account is not exist')

	// judge the name and password for login
	const [err2, loginflag] = await awaitWrap(service.judgeLogin(app.locals.db, name, password))
	if (err2) next(err2)
	if (loginflag === false) response.end('wrong password')

	request.session.name = name
	response.end(`Hello ${name}`)
})

app.use('/register', urllencodedParser, async (request, response, next) => { // submit register
	const { name } = request.body
	const { password } = request.body
	const validate = ajv.compile(schema)

	if (!validate({ name, password })) response.end(`Invalid: ${ajv.errorsText(validate.errors)}`)

	// find the user of the name
	const [err, userflag] = await awaitWrap(service.findUser(app.locals.db, name))
	if (err) next(err)
	if (userflag) response.end('Duplicate ID')

	// mongodb:isnert
	const [err2] = await awaitWrap(service.insertUser(app.locals.db, name, password))
	if (err2) next(err2)
	response.end('success create user!')
})

app.use('/start', async (request, response, next) => { // generate the random number
	const { name } = request.session
	const { id } = request.session

	if (id === undefined || name === undefined) response.end('Not logged in')

	const data = Math.floor(Math.random() * 1000000)

	const [err] = await awaitWrap(service.insertNumber(app.locals.db, data, id)) // isnert into number
	if (err) next(err)

	console.log(`randnum is:${data}`)
	response.end('OK')
})

app.use('/:number', async (request, response, next) => { // determine the number size
	const { name } = request.session
	const { id } = request.session
	const inputnumber = Number(request.params.number)
	if (id === undefined || name === undefined) response.end('Not logged in')

	// get the number of the user
	const [err, numberres] = await awaitWrap(service.getNumber(app.locals.db, id))
	if (err) next(err)
	if (!numberres) response.end('without start')

	if (Number.isNaN(inputnumber) || Number.isNaN(numberres)) { // judge number
		response.end('input not a number')
	} else if (inputnumber > numberres) {
		response.end('bigger')
	} else if (inputnumber < numberres) {
		response.end('smaller')
	}
	response.end('equal')
})
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
	console.error(err.stack)
	res.status(500).end(`error 500\n${err}`)
})

app.listen(8080)
