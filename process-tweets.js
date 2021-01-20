const { Writable, Readable, pipeline, Transform } = require('stream')

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
    logger
}
