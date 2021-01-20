require("dotenv").config()

const { pipeline } = require("stream")
const WebSocket = require("ws")
const  server  = require("./server")
const {connectToTwitter, tweetStream} = require("./twitter")
const {jsonParser, textExtractor, textSelector, initCounter } = require("./process-tweets")
const { getSearchRules, addSearchRules, deleteSearchRules} = require('./search-rules')


server.listen(3000)
const wsServer = new WebSocket.Server({ server })

wsServer.on("connection", (client) => {
    console.log('new connection: ', client)

    client.on("message", (message) => {
        console.log("message from client: ", message)
        client.send('Hello from server')
    })

    const tweetCounter = initCounter()

    const socketStream = WebSocket.createWebSocketStream(client)

    pipeline(
        tweetStream,
        jsonParser,
        // textExtractor,
        // textSelector,
        tweetCounter,
        socketStream,
        (err) => {
            if (err) {
                console.error("pieline error: ", err)
            }
        }
    )

    client.on("close", () => {
        socketStream.end()
    })
})


connectToTwitter()

async function resetRules() {
    const existingRules = await getSearchRules();
    const ids = existingRules?.data?.map(rule => rule.id)

    if(ids) {
        await deleteSearchRules(ids)
    }

    await addSearchRules([
        { value: "love", tag: "love"},
        { value: "hate", tag: "hate"}
    ])

    return Promise.resolve()
}

resetRules()

