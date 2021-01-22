const { createServer } = require("http")
const fs = require("fs/promises")

const server = createServer()

server.on("request", async (request, response) => {
    console.log("on request", request.method, request.url)

    if (request.url === "/") {
        makeResponse('index.html', response)
    } else if (request.url === "/main.css") {
        makeResponse('main.css', response)
    } else if (request.url === "/main.js") {
        makeResponse('main.js', response)
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
