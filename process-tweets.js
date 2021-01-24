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

const textExtractor = new Transform({
    writableObjectMode: true,

    transform(chunk, _, callback) {
        let text
        try {
            text = chunk.data.text
            this.push(text)
        } catch (error) {
        }

        console.log(text)
        callback()
    }
})

const textSelector = new Transform({
    objectMode: true,

    transform(chunk, _, callback) {
        try {
            if (chunk.includes(' hatred ') || chunk.includes(' hate ') || chunk.includes(' dislike ') || chunk.includes(' detest ')) {
                const tweet = {
                    type: 'hate',
                    tweet: chunk.toString()
                };
                tweetSorted = JSON.stringify(tweet);
                this.push(tweetSorted)
            }
            if (chunk.includes(' love ') || chunk.includes(' amour ') || chunk.includes(' tenderness ') || chunk.includes(' passion ')) {
                const tweet = {
                    type: 'love',
                    tweet: chunk.toString()
                };
                tweetSorted = JSON.stringify(tweet);
                this.push(tweetSorted)
            }

        } catch (error) {
        }

        callback()
    }
})

module.exports = {
    jsonParser,
    textExtractor,
    textSelector,
    getTweetFromSource
}
