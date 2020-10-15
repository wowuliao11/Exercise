
const should = require('should')
// require
const request = require('request')

const api = 'http://localhost:8081/'
describe('test number guess game ', () => {
    it('test page Start', (done) => {
        request(`${api}start`, (err, res, body) => {
            if (err) {
                throw err
            }
            body.should.eql('OK')
            done()
        })
    })
    it('test page Guess number', (done) => {
        for (let i = 0; i < 100; i += 1) {
            request(`${api}${i}`, (err, res, body) => {
                if (err) {
                    throw err
                }
                // console.log(body);
                body.should.match(/equal|bigger|smaller/)
            })
        }
        done()
    })
    it('test game playing', (done) => {
        function playgame(min, max) {
            const p = new Promise((resolve, reject) => {
                let num = Math.floor((min + max) / 2)
                let tempmin = min
                let tempmax = max
                request(`${api}${num}`, (err, res, body) => {
                    if (err) {
                        reject(new Error())
                        throw err
                    }
                    if (body === 'smaller') {
                        tempmin = num
                        num = Math.floor((max + min) / 2)
                        // console.log(`guess:${num}`)
                        playgame(tempmin, max)
                    }
                    if (body === 'bigger') {
                        tempmax = num
                        num = Math.floor((max + min) / 2)
                        // console.log(`guess:${num}`)
                        playgame(min, tempmax)
                    }
                    if (body === 'equal') {
                        // console.log(`guess:${num}`)
                        done()
                    }
                })
            })
        }
        playgame(0, 101)
    })
})
