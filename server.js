const { createServer } = require("http")
const fs = require("fs/promises")

const server = createServer()

server.on("request", async (request, response) => {
    if (request.url === "/") {
        makeResponse('index.html', response)
    } else if (request.url) {
        makeResponse(request.url, response)
    } else {
        response.writeHead(404)
        response.end()
    }
})

async function makeResponse(url, response) {
    const file = await fs.readFile(`./public/${url}`, "utf8")
    response.writeHead(200)
    response.end(file)
}

module.exports = server
