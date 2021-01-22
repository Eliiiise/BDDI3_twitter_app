require("dotenv").config()

const { pipeline, PassThrough, Transform } = require("stream")
const WebSocket = require("ws")
const  server  = require("./server")
const { connectToTwitter, tweetStream } = require("./twitter")
const {jsonParser, textExtractor, textSelector, initCounter, getTweetFromSource } = require("./process-tweets")
const { getSearchRules, addSearchRules, deleteSearchRules} = require('./search-rules')


server.listen(3000)
const wsServer = new WebSocket.Server({ server })

// create a passthrough: a transform that does nothing, just passing data through
const broadcaster = new PassThrough({
    writableObjectMode: true,
    readableObjectMode: true
})

wsServer.on("connection", (client) => {
    // console.log('new connection: ', client)

    let listWorld

    // create a new readable stream of tweets for this client
    const tweetSource = getTweetFromSource(broadcaster)

    client.on("message", (message) => {
        console.log("message from client: ", message)
        client.send('Hello from server')

        listWorld = message
    })

    const tweetCounter = new Transform({
        writableObjectMode: true,

        transform(chunk, _, callback) {
            // console.log('chunk : ', chunk)

            console.log(listWorld)

            if (chunk.matching_rules) {
                switch (chunk.matching_rules[0].tag) {
                    /* case 'love' :
                        this.counterLove ++
                        break */
                    case 'hate' :
                        this.counterHate ++
                        break
                    case `${listWorld}` :
                        this.counterLove ++
                        break
                }
            }

            this.counter ++

            // console.log('love : ', this.counterLove, '   |    hate : ', this.counterHate)

            const counters = {
                'love': this.counterLove,
                'hate': this.counterHate
            }

            this.push(JSON.stringify(counters))

            callback()
        }
    })

    tweetCounter.counterLove = 0
    tweetCounter.counterHate = 0

    const socketStream = WebSocket.createWebSocketStream(client)

    pipeline(
        //tweetStream,
        tweetSource,
        // jsonParser,
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

    socketStream.on("close", () => {
        socketStream.destroy()
    })
})

connectToTwitter()

// main pipeline, ending with broadcaster passthrough stream
pipeline(
    tweetStream,
    jsonParser,
    // add here what transform you want for ALL clients
    // remember to set objectMode when needed
    broadcaster,
    (err) => {
        console.log("main pipeline ended")
        if (err) {
            console.error("main pipeline error: ", err)
        }
        console.log(tweetStream)
    }
)

async function resetRules() {
    const existingRules = await getSearchRules();
    const ids = existingRules?.data?.map(rule => rule.id)

    if(ids) {
        await deleteSearchRules(ids)
    }

    await addSearchRules([
        { value: "detest", tag: "hate"},
        { value: "wimp", tag: "hate"},
        { value: "crap", tag: "hate"}, /*
        { value: "fuck", tag: "hate"},
        { value: "fucking", tag: "hate"},
        { value: "hate", tag: "hate"},
        { value: "shit", tag: "hate"},
        { value: "bastard", tag: "hate"}, */
        { value: "love", tag: "love"},
        { value: "passion", tag: "passion"},
        { value: "lust", tag: "lust"},
        { value: "amour", tag: "amour"},
        { value: "crush", tag: "crush"}

    ])

    getSearchRules()


    return Promise.resolve()
}

resetRules()
