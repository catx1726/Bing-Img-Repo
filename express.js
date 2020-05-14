const express = require('express')
const fs = require('fs')
const app = express()
const port = '8088'

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

const server = app.listen(port, () => {
    console.log(`server running at http://127.0.0.1:${port}`)
})
