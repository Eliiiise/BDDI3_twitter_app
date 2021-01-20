const { Writable, Transform } = require('stream')

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

function initCounter() {
    const tweetCounter = new Transform({
        writableObjectMode: true,

        transform(chunk, _, callback) {
            console.log('chunck : ', chunk)

            if (chunk.matching_rules) {
                switch (chunk.matching_rules[0].tag) {
                    case 'love' :
                        this.counterLove ++
                        break
                    case 'hate' :
                        this.counterHate ++
                        break
                }
            }

            this.counter ++

            console.log('love : ', this.counterLove, '   |    hate : ', this.counterHate)

            const counters = {
                'love': this.counterLove,
                'hate': this.counterHate
            }

            this.push(JSON.stringify(counters))

            callback()
        }
    })

    tweetCounter.counterLove = 0
    tweetCounter.counterHate = 0

    return tweetCounter
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

// faire les traitements avec transform

const logger = new Writable({
    objectMode: true,
    write(chunk, encoding, callback) {
        try {
            console.log(JSON.stringify(chunk))
        } catch (err) {
            //
        }
        callback()
    }
})

module.exports = {
    jsonParser,
    logger,
    textExtractor,
    initCounter,
    textSelector
}
