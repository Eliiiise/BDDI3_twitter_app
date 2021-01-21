require("dotenv").config()

const { pipeline } = require("stream")
const WebSocket = require("ws")
const  server  = require("./server")
const {connectToTwitter, tweetStream} = require("./twitter")
const {jsonParser, textExtractor, textSelector, initCounter } = require("./process-tweets")
const { getSearchRules, addSearchRules, deleteSearchRules} = require('./search-rules')
const rulesInit = { value: "detest", tag: "hate"}
const listWorld = []


server.listen(3000)
const wsServer = new WebSocket.Server({ server })

wsServer.on("connection", (client) => {
    // console.log('new connection: ', client)

    const tweetCounter = initCounter()

    client.on("message", (message) => {
        console.log("message from client: ", message)
        client.send('Hello from server')

        async function add() {
            // await resetRules()

            if(!listWorld.includes(message)) {
                listWorld.push('list : ', message)
                console.log(listWorld)
            }

            await addSearchRules([{ value: message, tag: "love"}])
            getSearchRules()
        }

        add()
    })

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

    client.on('close', () => {
        console.log('close')
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
        { value: "detest", tag: "hate"} /*,
        { value: "fuck", tag: "hate"},
        { value: "fucking", tag: "hate"},
        { value: "hate", tag: "hate"},
        { value: "wimp", tag: "hate"},
        { value: "shit", tag: "hate"},
        { value: "crap", tag: "hate"},
        { value: "bastard", tag: "hate"} */
    ])

    getSearchRules()


    return Promise.resolve()
}

resetRules()
