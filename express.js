const express = require('express')
const app = express()
const port = '8088'

app.get('/public', (req, res) => {
    res.sendFile(__dirname + '/imgs/bing/2020/05')
    console.log('Request for ' + req.url + ' received.')
})

const server = app.listen(port, () => {
    console.log(`server running at http://127.0.0.1:${port}`)
})
