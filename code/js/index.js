const DOC = document
const _d = new Date()

// 获取当前 year / month 用于请求使用
let nowYear = _d.getFullYear(),
    nowMonth = _d.getMonth() + 1

// 存储当天图片的时间 如 20200509
let imgDay = 0,
    imgMonth = 0,
    imgYear = 0

let pureImgSrc = ''

// 1. 获取到一周的图片
function imgLoad() {
    let urlList = []
    fetch(
        `http:test.dev.adoba.site:81/public/${nowYear}/${nowMonth}/`
    ).then((res) => console.log(res))

    // ~~ 1. 获取到 BING 的日推图片 ~~
    //'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1', // 此接口需要用 nginx处理跨域请求
    // 备用 'https://api.berryapi.net/?service=App.Bing.Images'
    // fetch(
    //     'https://bing.adoba.site/proxy/bing/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN'
    // )
    //     .then((res) => res.json())
    //     .then((jsonRes) => {
    //         let img = jsonRes.images[0]
    //         pureImgSrc = 'https://bing.adoba.site/proxy/bing' + img.url
    //         imgDay = _d.getDate(img.enddate)
    //         imgMonth = _d.getMonth(img.enddate) + 1
    //         imgYear = _d.getFullYear(img.enddate)
    //         let time = `${imgYear}年${imgMonth}月${imgDay}`
    //         console.log(
    //             `fetch ${time} bing-img jsonRes:`,
    //             jsonRes,
    //             ` and img-url:${pureImgSrc} and imgDay:${imgDay} and imgMonth:${imgMonth} and imgYear:${imgYear}`
    //         )
    //         DOC.querySelector('#bing-img-container').src = pureImgSrc
    //     })
}
imgLoad()

// 基本交互
let imgs = DOC.querySelectorAll('.img-item'),
    slideContainer = DOC.querySelector('.slide-container'),
    prev = DOC.querySelector('.prev'),
    next = DOC.querySelector('.next'),
    imgDes = DOC.querySelector('.img-else-container'),
    imgLen = imgs.length,
    nowNum = 0,
    imgClick = false

next.addEventListener('click', nextImg, false)
prev.addEventListener('click', prevImg, false)
slideContainer.addEventListener('click', showDetail, false)

// 单时隐藏 字体 和 trigger
function showDetail() {
    imgClick = !imgClick
    // 隐藏
    if (imgClick) {
        prev.style.opacity = '0'
        next.style.opacity = '0'
        imgDes.style.opacity = '0'
    } else {
        // 显示
        prev.style.opacity = '.1'
        next.style.opacity = '.1'
        imgDes.style.opacity = '1'
    }
}
function nextImg() {
    nowNum < imgLen - 1 ? nowNum++ : false
    let temp = -100 * nowNum + 'vw'
    slideContainer.style.transform = `translateX(${temp})`
}
function prevImg() {
    nowNum ? nowNum-- : false
    let temp = -100 * nowNum + 'vw'
    slideContainer.style.transform = `translateX(${temp})`
}

// function checkUpdate() {
//     let tempDate = new Date(),
//         nowMonth = tempDate.getMonth() + 1,
//         nowDay = tempDate.getDate(),
//         nowYear = tempDate.getFullYear()

//     if (nowMonth !== imgMonth || nowYear !== imgYear) {
//         // 年月份跨度，更新
//         console.log('year / month changed ')
//         imgLoad()
//         return { message: 'year / month 图片更新啦' }
//     }
//     if (nowDay !== imgDay) {
//         // 更新
//         console.log('day changed')
//         imgLoad()
//         return { message: 'day 图片更新啦' }
//     }
//     // 没更新，静默
//     return false
// }
// 十分钟检测一次 BING 是否更新了图片
// setInterval('checkUpdate()', 10 * 60 * 1000)

// 3. 调用放大图片接口
// 3.1 保存放大图片到GitHub
// 4. 24H循环整个流程(附带检测如果有重名的就不放大，也不保存)
