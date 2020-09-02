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

// 检测日期是否为 1号，然后创建目录 /bing/year/month
const createMkdir = (path, year, month, date) => {
    console.log(`今天 ${year}年${month}月${date} 号！`)
    if (date !== 1) {
        return false
    }
    fs.mkdir(
        `${__dirname}/${path}/${year}/${month}`,
        { recursive: true },
        (err) => {
            if (err) {
                throw err
                console.error(err)
            }
        }
    )
    return true
}

const getImg = () => {
    console.log('getImg start.')
    request.get(
        'http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN',
        (err, res, body) => {
            const _d = new Date(),
                img = JSON.parse(body).images[0],
                url = img.url,
                name = img.urlbase.split('=')[1],
                year = img.enddate.slice(0, 4),
                month = img.enddate.slice(4, 6),
                date = _d.getDate(),
                reqUrl = 'http://cn.bing.com' + url
            createMkdir('imgs/bing', year, month, date)
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
                            year,
                            month,
                        }
                        // TODO 本地测试时，将其关闭
                        github()
                    })
            )
        }
    )
}

// 导出后，24H检测一次Bing是否更新壁纸
module.exports = getImg

// 测试执行
getImg()
// createMkdir('imgs/bing', '2020', '06', 1)

/* 定时任务 */
const schedule = require('node-schedule')
// const getImg = require('./main')

// 每天早上 8:00 执行，其实这里不用定时，因为我服务器设置了定时重启，届时也会重启pm2，然后运行相应命令进行下载
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
    // TODO 2020年5月20日 这里可以写成 Promise 、async / await 形式
    // 可以上传为4K，且普通素质的图片已经下载完，且没有在处理中
    if (todayImg.status && !todayImg.lock) {
        // BigImgAPI.upload(todayImg)
        console.log('上传4k接口')
        return true
    }
    if (todayImg.lock && todayImg.tid) {
        // BigImgAPI.download(todayImg)
        console.log('下载4k接口')
        return true
    }
    console.log('...等普通图片或者也可能是卡住了')
    return false
}

// setInterval(check4KImg, 600000)
