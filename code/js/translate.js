/* 
    放大图片的方法，将 main 中的今日图片 name 拿到这边
    拼接成 https://cn.bing.com/th?id=${name}_1920x1080.jpg 形式
    然后调用 Bigjpg 的API，然后保存其 task_id
    定时调用 Bigjpg 的用来检测 task 是否完成的 API 
    如果完成 则保存其 图片地址 进行下载到本地，然后指定好 express 请求
*/

const request = require('request')

let bigJpgApi = {
    upload,
    download,
}

function upload(imgObj) {
    let conf = {
        style: 'photo',
        noise: '1',
        x2: '2',
        input: imgObj.reqUrl,
    }
    imgObj.lock = true
    console.log('imgObj:', imgObj)
    request.post(
        {
            url: 'https://bigjpg.com/api/task/',
            headers: { 'X-API-KEY': '684d4bdcc560497f889f895a3f726ff5' },
            form: { conf: JSON.stringify(conf) },
        },
        (error, res, body) => {
            console.error('error:', error)
            // 当照片放大之后，会返回一个 pid 届时定时检测 pid 是否返回 true
            imgObj.tid = body.tid
            console.log('up api res:', body, res.statusCode)
        }
    )
}

function download(imgObj) {
    // 通过 imgObj.tid 查询状态，true 就保存到服务器，然后调用 GitHub.js
    console.log('down test')
}

console.log('bigJpgApiList:', bigJpgApi)
module.exports = bigJpgApi
