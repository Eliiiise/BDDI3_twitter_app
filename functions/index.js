const functions = require('firebase-functions');
const { createServer } = require("http")
const fs = require("fs/promises")

exports.bigben = functions.https.onRequest((req, res) => {

    if (req.url === "/") {
        makeResponse('index.html', res)
    } else if (req.url) {
        makeResponse(req.url, res)
    } else {
        res.writeHead(404)
        res.end()
    }

    async function makeResponse(url, res) {
        const file = await fs.readFile(`../public/${url}`, "utf8")
        res.writeHead(200)
        res.end(file)
    }

});
