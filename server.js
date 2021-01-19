const { createServer } = require("http")
const fsPromise = require("fs/promises")

const server = createServer()

server.on("request", (request, response) => {
    console.log("on request", request.method, request.url)

    if (request.url === "/") {
        response.writeHead(200)

        /*fs.readFile("./test.txt", "utf8", (err, data) => {
            if(err) {
                console.error(err)
                response.end(err)
                return
            }
            response.end(data)
        })*/

        const htmlFile = fsPromise.readFile("./htmlFile.txt", "utf8")

        htmlFile
            .then((data) => {
                response.end(data)
            })
            .catch((err) => {
                response.end(err)
            })


    } else {
        response.writeHead(404)
        response.end("Error 404")
    }
})

module.exports = server
