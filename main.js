/* 
    DES 丢到服务器上的代码
    1. 拉取 Bing 请求，保存图片到服务器
    2. push 服务器端的图片到 GitHub
    3. 创建 express服务 响应用户请求，返回一周图片列表
*/

/* request 组件已经不在维护，可考虑使用 axios 或者 浏览器原生的fetch  */

const request = require('request')
const fs = require('fs')
const path = require('path')
const github = require('./code/js/github')
let todayImg = {}

const getImg = () => {
    console.log('getImg start.')
    request.get(
        'http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN',
        (err, res, body) => {
            const img = JSON.parse(body).images[0],
                url = img.url,
                name = img.urlbase.split('=')[1],
                year = img.enddate.slice(0, 4),
                month = img.enddate.slice(4, 6),
                reqUrl = 'http://cn.bing.com' + url

            request(reqUrl).pipe(
                fs
                    .createWriteStream(
                        path.join(
                            __dirname,
                            `./imgs/bing/${year}/${month}`,
                            name + '.jpg'
                        )
                    )
                    .on('close', () => {
                        console.log(`${name} done !`)
                        todayImg = {
                            name,
                            reqUrl,
                            status: true,
                            fourK: false,
                            lock: false,
                            tid: '',
                        }
                        // TODO 本地测试时，暂时关闭
                        // github()
                    })
            )
        }
    )
}

// 导出后，24H检测一次Bing是否更新壁纸
module.exports = getImg

// 测试执行
getImg()

/* 定时任务 */
const schedule = require('node-schedule')
// const getImg = require('./main')

// 每天早上 8:00 执行
const rule = new schedule.RecurrenceRule()
rule.dayOfWeek = [0, new schedule.Range(1, 6)]
rule.hour = 8
rule.minute = 0

schedule.scheduleJob(rule, () => {
    getImg()
})

// 检查是否有资格上传为 4k
const BigImgAPI = require('./code/js/translate')

function check4KImg() {
    // 可以上传为4K，且普通素质的图片已经下载完，且没有在处理中
    if (todayImg.status && !todayImg.lock) {
        BigImgAPI.upload(todayImg)
        return true
    }
    if (todayImg.lock && todayImg.tid) {
        console.log('提交接口')
    }
}

setInterval(check4KImg, 1000)
