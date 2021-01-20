const { Readable, Writable } = require('stream')
const http = require('https')

const TWT_API_HOST = 'api.twitter.com'
const TWT_API_PATH = '/2/tweets/sample/stream?tweet.fields=attachments,author_id,geo,entities&expansions=author_id,attachments.media_keys,geo.place_id&media.fields=url&place.fields=contained_within,country,country_code,full_name,geo,id,name,place_type&user.fields=profile_image_url'
const BEARER_TOKEN = process.env.TWT_BEARER_TOKEN

const options = {
    host: TWT_API_HOST,
    path: TWT_API_PATH,
    method: 'GET',
    headers: {
        Authorization: 'Bearer ' + BEARER_TOKEN
    }
}

const tweetStream = new Readable({
    read() { }
})

function connectToTwitter() {
    const req = http.request(options, (res) => {
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
