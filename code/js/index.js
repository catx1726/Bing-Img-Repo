const DOC = document
const _d = new Date()
// 存储当天图片的时间 如 20200509
let imgDay = 0,
    imgMonth = 0,
    imgYear = 0

let pureImgSrc = ''

function imgLoad() {
    // 1. 获取到 BING 的日推图片
    //'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1', // 此接口需要用 nginx处理跨域请求
    // 备用 'https://api.berryapi.net/?service=App.Bing.Images'
    fetch(
        'https://bing.adoba.site/proxy/bing/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN'
    )
        .then((res) => res.json())
        .then((jsonRes) => {
            let img = jsonRes.images[0]
            pureImgSrc = 'https://bing.adoba.site/proxy/bing' + img.url
            imgDay = _d.getDate(img.enddate)
            imgMonth = _d.getMonth(img.enddate) + 1
            imgYear = _d.getFullYear(img.enddate)
            let time = `${imgYear}年${imgMonth}月${imgDay}`
            console.log(
                `fetch ${time} bing-img jsonRes:`,
                jsonRes,
                ` and img-url:${pureImgSrc} and imgDay:${imgDay} and imgMonth:${imgMonth} and imgYear:${imgYear}`
            )
            DOC.querySelector('#bing-img-container').src = pureImgSrc
        })
}
imgLoad()

function checkUpdate() {
    let tempDate = new Date(),
        nowMonth = tempDate.getMonth() + 1,
        nowDay = tempDate.getDate(),
        nowYear = tempDate.getFullYear()

    if (nowMonth !== imgMonth || nowYear !== imgYear) {
        // 年月份跨度，更新
        console.log('year / month changed ')
        imgLoad()
        return { message: 'year / month 图片更新啦' }
    }
    if (nowDay !== imgDay) {
        // 更新
        console.log('day changed')
        imgLoad()
        return { message: 'day 图片更新啦' }
    }
    // 没更新，静默
    return false
}
// 十分钟检测一次 BING 是否更新了图片
setInterval('checkUpdate()', 1000)

// 2. 保存原始图片到GitHub
// function beforeDown() {
//     console.log('down')
//     fetch('https://imgchr.com/json', {
//         credentials: 'include',
//         headers: {
//             'User-Agent':
//                 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:75.0) Gecko/20100101 Firefox/75.0',
//             Accept: 'application/json',
//             'Accept-Language':
//                 'zh-CN,zh;q=0.8,zh-TW;q=0.7,zh-HK;q=0.5,en-US;q=0.3,en;q=0.2',
//             'Content-Type':
//                 'multipart/form-data; boundary=---------------------------283715647122960015543343553279',
//         },
//         body: `https:${pureImgSrc}`,
//         method: 'POST',
//         mode: 'cors',
//     })
//         .then((res) => res.json())
//         .then((resJson) => console.log(resJson))
// }
// beforeDown()
// 3. 调用放大图片接口
// 3.1 保存放大图片到GitHub
// 4. 24H循环整个流程(附带检测如果有重名的就不放大，也不保存)
