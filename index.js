require('dotenv').config()

const { pipeline } = require('stream')
const server = require('./server')
const {connectToTwitter, tweetStream} = require('./twitter')
const {jsonParser, logger} = require('./process-tweets')
const WebSocket = require('ws')


// server http
server.listen(3000)
const wsServer = new WebSocket.Server({ server })

wsServer.on('connection', (client) => {
    console.log("new connection: ", client)

    client.on('message', (message) => {
        console.log('message from client: ', message)

        client.send('hello from server')
    })

    tweetStream.on('data', (chunk) => {
        client.send(chunk)
    })
})

// connexion API Twitter
 connectToTwitter()

// traiter les tweets (via transform)
pipeline(
    tweetStream,
    jsonParser,
    logger,
    (err) => {
        if (err) {
            console.error('pieline error: ', err)
        }
    }
)

// envoyer des données au client via websocket
// const wsServer = new WebSocket.Server({
// server
// })
