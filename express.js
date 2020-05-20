const express = require('express')
const app = express()
const fs = require('fs')
const port = '8088'
const https = require('https')
const http = require('http')

var httpsServer = https.createServer(
    {
        key: fs.readFileSync('./cert/privatekey.pem', 'utf8'),
        cert: fs.readFileSync('./cert/certificate.crt', 'utf8'),
    },
    app
)

// 拿到普通素质的图片名
app.get('/public/bing/:year/:month/', (req, res) => {
    // DES 这个请求应该接受 年月的参数，然后去响应文件夹下获取所有jpg文件，返回一个url数组
    try {
        let list = fs.readdirSync(
            `./imgs/bing/${req.params['year']}/${req.params['month']}`
        )
        res.send(list)
        console.log(
            `Request for ${req.url} received. year:${req.params['year']},month:${req.params['month']}`
        )
    } catch (error) {
        console.log(error)
        res.send('sorry')
    }
})

// 返回 4k 图片
app.get('/public/bing/:year/:month/4k/:name', (req, res) => {
    // DES 这个请求应该接受 年月的参数，然后去响应文件夹下获取所有jpg文件，返回一个url数组
    try {
        let name = req.params['name']
        res.sendFile(
            `./imgs/bing/${req.params['year']}/${req.params['month']}/4k/name`
        )
        console.log(
            `Request for ${req.url} received. year:${req.params['year']},month:${req.params['month']}/4k/${name}`
        )
    } catch (error) {
        console.log(error)
        res.send('不好意思，该图片还没有4k化，主要原因是...')
    }
})

httpsServer.listen(port, () => {
    console.log(`https server running at https://127.0.0.1:${port}`)
})
