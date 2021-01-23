const socket = new WebSocket(`ws://${window.location.hostname}:${window.location.port}`);

socket.addEventListener('message', async function (event) {
    try{
        let data = await event.data.text()
        data = JSON.parse(data)

        const love = document.querySelector('.js-love')
        const hate = document.querySelector('.js-hate')
        const lovePart = document.querySelector('.js-love-part')
        const hatePart = document.querySelector('.js-hate-part')
        const titleLove = document.querySelector('.js-title-love')
        const titleHate = document.querySelector('.js-title-hate')

        love.innerHTML = Math.round(( data.love * 100 ) / ( data.hate + data.love )) + '%'
        hate.innerHTML = Math.round(( data.hate * 100 ) / ( data.hate + data.love )) + '%'

        lovePart.style.width = ( data.love * 40 ) / ( data.hate + data.love ) + 30 + '%'
        hatePart.style.width = ( data.hate * 40 ) / ( data.hate + data.love ) + 30 + '%'

        titleLove.style.transform = `scale(${( data.love * 0.4 ) / ( data.hate + data.love ) + 0.6})`
        titleHate.style.transform = `scale(${( data.hate * 0.4 ) / ( data.hate + data.love ) + 0.6})`

    } catch(err){
    }
});

socket.addEventListener('open', function (event) {
    // console.log('connected', event)
    // socket.send('Hello from client')
});

const buttons = document.querySelectorAll('.js-btn')
let list = []

buttons.forEach((button) => {
    button.addEventListener('click', () => {

        if (!button.classList.contains('select')) {
            // 3 words select max
            if (list[list.length-3] && document.querySelectorAll('.select').length > 2) {
                const unselect = list[list.length-3]
                document.querySelector(`[data-value='${unselect}']`).classList.remove('select')
            }

            // add new word select
            button.classList.add('select')
            list.push(button.dataset.value)

        } else {
            // remove word already select
            button.classList.remove('select')

            for (let i = list.length-1; i > list.length - 4; i--) {
                if (list[i] === button.dataset.value) {
                    list.splice(i, 1);
                }
            }
        }

        // send to server list of selected words
        let SelectedWords = []

        for (let i = list.length-1; i > list.length - (document.querySelectorAll('.select').length + 1); i--) {
            SelectedWords.push(list[i])
        }

        socket.send(SelectedWords)
    })
})
