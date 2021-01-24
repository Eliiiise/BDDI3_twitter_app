const { Transform, Readable } = require('stream')

const jsonParser = new Transform({
    readableObjectMode: true,

    transform(chunk, _, callback) {
        let data = {}
        try {
            data = JSON.parse(chunk)
        } catch (error) {

        }
        this.push(data)
        callback()
    }
})

function getTweetFromSource(broadcaster) {
    // create a new source stream for each client
    const tweetSource = new Readable({
        objectMode: true,
        read() { }
    })

    // data event callback
    function pushToSource(chunk) {
        tweetSource.push(chunk)
    }

    // listen to new data from main pipeline and push it to client stream
    broadcaster.on("data", pushToSource)

    // remove event listener if error, emitted from client pipeline
    tweetSource.on("error", () => {
        broadcaster.off("data", pushToSource)
    })

    return tweetSource
}

module.exports = {
    jsonParser,
    getTweetFromSource
}
