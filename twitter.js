const { Readable, Writable } = require('stream')
const http = require('https')

const TWT_API_HOST = 'api.twitter.com'
const TWT_API_SEARCH_PATH = "/2/tweets/search/stream?tweet.fields=attachments,author_id,geo,entities&expansions=author_id,attachments.media_keys&media.fields=url&user.fields=public_metrics"
const BEARER_TOKEN = process.env.TWT_BEARER_TOKEN

const options = {
    host: TWT_API_HOST,
    headers: {
        Authorization: 'Bearer ' + BEARER_TOKEN
    }
}

const tweetStream = new Readable({
    read() { }
})

 function connectToTwitter() {
    const opts = {
        ...options,
        method: 'GET',
        path: TWT_API_SEARCH_PATH,
    }

    const req = http.request(opts, (res) => {
        res.on('data', (chunk) => {
            tweetStream.push(chunk)
        })
    })

    req.on('error', (error) => {
        console.error(error)
    })

    req.end()
}

module.exports = {
    tweetStream,
    connectToTwitter
}
