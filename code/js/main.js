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
const github = require('./github')

const getImg = () => {
    console.log('getImg start.')
    request.get(
        'http://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN',
        (err, res, body) => {
            const img = JSON.parse(body).images[0],
                url = img.url,
                name = img.copyright,
                year = img.enddate.slice(0, 4),
                month = img.enddate.slice(4, 6)

            request(`http://cn.bing.com${url}`).pipe(
                fs
                    .createWriteStream(
                        path.join(
                            `./imgs/bing/${year}/${month}/`,
                            name + '.jpg'
                        )
                    )
                    .on('close', () => {
                        console.log(`${name} done !`)
                        github()
                    })
            )
        }
    )
}

// 导出后，24H检测一次Bing是否更新壁纸
module.exports = getImg

getImg()

/* 定时任务 */
const schedule = require('node-schedule')
// const getImg = require('./main')

const rule = new schedule.RecurrenceRule()
rule.dayOfWeek = [0, new schedule.Range(1, 6)]
rule.hour = 8
rule.minute = 0

schedule.scheduleJob(rule, () => {
    getImg()
})
