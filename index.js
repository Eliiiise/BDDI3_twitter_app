require("dotenv").config()

const { pipeline, PassThrough, Transform } = require("stream")
const WebSocket = require("ws")
const  server  = require("./server")
const { connectToTwitter, tweetStream } = require("./twitter")
const {jsonParser, getTweetFromSource } = require("./process-tweets")
const { getSearchRules, addSearchRules, deleteSearchRules} = require('./search-rules')

server.listen(3000)
const wsServer = new WebSocket.Server({ server })

// create a passthrough: a transform that does nothing, just passing data through
const broadcaster = new PassThrough({
    writableObjectMode: true,
    readableObjectMode: true
})

wsServer.on("connection", (client) => {

    let listWords = Array(3)

    // create a new readable stream of tweets for this client
    const tweetSource = getTweetFromSource(broadcaster)

    client.on("message", (message) => {

        listWords = Array(3)

        message = message.split(',')

        for (let i = 0; i < message.length; i++) {
            listWords[i]  = message[i]
        }
    })

    const tweetCounter = new Transform({
        writableObjectMode: true,

        transform(chunk, _, callback) {

            let word = ''

            if (chunk.matching_rules) {
                switch (chunk.matching_rules[0].tag) {
                    case 'detest' :
                        this.counterHate ++
                        word = 'detest'
                        break
                    case 'crap' :
                        this.counterHate ++
                        word = 'crap'
                        break
                    case 'fuck' :
                        this.counterHate ++
                        word = 'fuck'
                        break
                    case 'fucking' :
                        this.counterHate ++
                        word = 'fucking'
                        break
                    case 'hate' :
                        this.counterHate ++
                        word = 'hate'
                        break
                    case 'break' :
                        this.counterHate ++
                        word = 'break'
                        break
                    case 'damn' :
                        this.counterHate ++
                        word = 'damn'
                        break
                    case 'shit' :
                        this.counterHate ++
                        word = 'shit'
                        break
                    case `${listWords[0]}` :
                        this.counterLove ++
                        word = listWords[0]
                        break
                    case `${listWords[1]}` :
                        this.counterLove ++
                        word = listWords[1]
                        break
                    case `${listWords[2]}` :
                        this.counterLove ++
                        word = listWords[2]
                        break
                }
            }

            const counters = {
                'love': this.counterLove,
                'hate': this.counterHate,
                'word' : word
            }

            this.push(JSON.stringify(counters))

            callback()
        }
    })

    tweetCounter.counterLove = 0
    tweetCounter.counterHate = 0

    const socketStream = WebSocket.createWebSocketStream(client)

    pipeline(
        tweetSource,
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
    broadcaster,
    (err) => {
        console.log("main pipeline ended")
        if (err) {
            console.error("main pipeline error: ", err)
        }
    }
)

async function resetRules() {
    const existingRules = await getSearchRules();
    const ids = existingRules?.data?.map(rule => rule.id)

    if(ids) {
        await deleteSearchRules(ids)
    }

    await addSearchRules([
        { value: "detest", tag: "detest"},
        { value: "crap", tag: "crap"},
        { value: "fuck", tag: "fuck"},
        { value: "fucking", tag: "hate"},
        { value: "break", tag: "break"},
        { value: "damn", tag: "damn"},
        { value: "shit", tag: "shit"},
        { value: "hate", tag: "hate"},
        { value: "love", tag: "love"},
        { value: "kiss", tag: "kiss"},
        { value: "flirt", tag: "flirt"},
        { value: "passion", tag: "passion"},
        { value: "lust", tag: "lust"},
        { value: "amour", tag: "amour"},
        { value: "crush", tag: "crush"}

    ])

    getSearchRules()


    return Promise.resolve()
}

resetRules()
