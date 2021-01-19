const http = require('https')
const { Readable, pipeline, Transform, Writable } = require('stream')

const server = require("./server")

server.listen(3000)

const TWT_API_HOST = "api.twitter.com"
const TWT_API_PATH = "/2/tweets/sample/stream?tweet.fields=attachments,author_id,geo&expansions=author_id,attachments.media_keys&media.fields=url"
const BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAKeyLwEAAAAAcX48qgy7uYXkdp1B7Q4Jno93ft8%3D9iaegUlC7ITdsNwtnCbxo23IFPtcGs2PUNVEXVDwBnfgUkSMsp"

const options = {
    host: TWT_API_HOST,
    path: TWT_API_PATH,
    method: "GET",
    headers: {
        Authorization: "Bearer " + BEARER_TOKEN
    }
}

const jsonParser = new Transform({
    readableObjectMode: true,

    transform(chunk, _, callback) {
        let data = []
        try {
            data = JSON.parse(chunk)
        } catch (error) {

        }
        this.push(data)
        callback()
    }
})

const logger = new Writable({
    objectMode: true,
    write(chunk, encoding, callback) {
        try {
            console.log(JSON.stringify(chunk))
        } catch (error) {
            //
        }
        callback()
    }
})

const tweetStream = new Readable({
    read() {}
})

const req = http.request(options, (res) => {
    res.on('data', (chunk) => {
        // console.log("data: ", chunk.toString())
        tweetStream.push(chunk)
    })
})

req.on('error', (error) => {
    console.error(error)
})

req.end()

pipeline(
    tweetStream,
    jsonParser,
    logger,
    // toClient,
    (err) => {
        console.error(err)
    }
)


