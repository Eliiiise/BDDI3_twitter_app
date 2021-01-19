const http = require('https')

const TWT_API_HOST = "api.twitter.com"
const TWT_API_URL = "/2/tweets/sample/stream"
const BEARER_TOKEN = "AAAAAAAAAAAAAAAAAAAAAKeyLwEAAAAAcX48qgy7uYXkdp1B7Q4Jno93ft8%3D9iaegUlC7ITdsNwtnCbxo23IFPtcGs2PUNVEXVDwBnfgUkSMsp"

const options = {
    host: TWT_API_HOST,
    path: TWT_API_URL,
    method: "GET",
    headers: {
        Authorization: "Bearer " + BEARER_TOKEN
    }
}

const req = http.request(options, (res) => {
    res.on('data', (chunk) => {
        console.log("data: ", chunk.toString())
    })
})

req.on('error', (error) => {
    console.error(error)
})

req.end()


