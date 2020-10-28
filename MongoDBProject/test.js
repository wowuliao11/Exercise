const { MongoClient } = require('mongodb')
const service = require('./service')

const uri = 'mongodb://root:admin@localhost:10086/game?retryWrites=true&w=majority'

// async function test() {
// 	const client = await MongoClient.connect(uri, { useUnifiedTopology: true })
// 	const db = client.db('game')
// 	const res = await service.findNumber(db, 'user2')
// 	console.log(res)
// }
// test()
function test() {
	return [null, 2]
}
const [a] = test()
console.log(a)
