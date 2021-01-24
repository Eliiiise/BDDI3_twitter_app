require("dotenv").config()

const { pipeline, PassThrough, Transform } = require("stream")
const WebSocket = require("ws")
const  server  = require("./server")
const { connectToTwitter, tweetStream } = require("./twitter")
const {jsonParser, textExtractor, textSelector, getTweetFromSource } = require("./process-tweets")
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

    let listWords = Array(3)

    // create a new readable stream of tweets for this client
    const tweetSource = getTweetFromSource(broadcaster)

    client.on("message", (message) => {
        // console.log("message from client: ", message)
        // client.send('Hello from server')

        listWords = Array(3)

        message = message.split(',')

        for (let i = 0; i < message.length; i++) {
            listWords[i]  = message[i]
        }
    })

    const tweetCounter = new Transform({
        writableObjectMode: true,

        transform(chunk, _, callback) {
            // console.log(chunk, this.counterHate)

            let word = ''

            if (chunk.matching_rules) {
                switch (chunk.matching_rules[0].tag) {
                    case 'detest' :
                        this.counterHate ++
                        word = 'detest'
                        break
                    case 'wimp' :
                        this.counterHate ++
                        word = 'wimp'
                        break
                    case 'crap' :
                        this.counterHate ++
                        word = 'crap'
                        break
                    case 'fuck' :
                        this.counterHate ++
                        word = 'fuck'
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

            // console.log('love : ', this.counterLove, '   |    hate : ', this.counterHate)

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
        { value: "detest", tag: "detest"},
        { value: "wimp", tag: "wimp"},
        { value: "crap", tag: "crap"},
        { value: "fuck", tag: "fuck"},
        { value: "fucking", tag: "hate"},
        { value: "hate", tag: "hate"},
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
