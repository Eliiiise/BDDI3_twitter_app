const needle = require("needle")

const TWT_API_URL = 'https://api.twitter.com/2/tweets/search/stream/rules';
const options =  {
    headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${process.env.TWT_BEARER_TOKEN}`
    }
}

async function getSearchRules(){
    const response = await needle('get', TWT_API_URL , options)
    console.log('get search rules : ', response.body)
    return response.body
}

async function deleteSearchRules(ids){
    const data = {
        delete: {
            ids
        }
    }
    const response = await needle('post', TWT_API_URL, data, options)
    console.log("delete rules :", response.body)
}

async function addSearchRules(rules){
    const data = {
        add: rules
    }
    const response = await needle('post', TWT_API_URL, data, options)
    console.log("add rules :", response.body, "option : ", data)
}

module.exports = {
    getSearchRules,
    addSearchRules,
    deleteSearchRules
}
