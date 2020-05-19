const DOC = document
const _d = new Date()

// 基本交互的一些数据
let imgs = '',
    slideContainer = DOC.querySelector('.slide-container'),
    prev = DOC.querySelector('.prev'),
    next = DOC.querySelector('.next'),
    downloadBtn = DOC.querySelector('.down-button'),
    downTrigger = DOC.querySelector('.down-trigger'),
    // imgDes = DOC.querySelector('.img-else-container'),
    imgLen = 0, // imgs 总数量
    nowNum = 0, // 当前第几张
    imgClick = false

// 获取当前 year / month 用于请求使用
let nowYear = _d.getFullYear(),
    nowMonth = _d.getMonth() + 1

// 传递格式 https://test.dev.adoba.site/public/bing/2020/05/
nowMonth = nowMonth < 9 ? '0' + nowMonth : nowMonth

// 存储当天图片的时间 如 20200509
let imgDay = 0,
    imgMonth = 0,
    imgYear = 0

// 请求返回的地址数组: OHR.NorthRimOpens_ZH-CN9513300299.jpg
// https://cn.bing.com/th?id=OHR.NorthRimOpens_ZH-CN9513300299_1920x1080.jpg
let fetchTemp = 'https://cn.bing.com/th?id=',
    size = '_1920x1080.jpg'

// 标准 src 数组
let imgSrcList = []

// 1. 获取到一周的图片
function imgLoad() {
    let urlList = []
    fetch(`https://dev.adoba.site/public/bing/${nowYear}/${nowMonth}/`)
        .then((res) => {
            // console.log('原始数据：', res)
            return res.json()
        })
        .then((resJson) => {
            resJson.forEach((i) => {
                let idx = i.lastIndexOf('.jpg')
                imgSrcList.push(fetchTemp + i.slice(0, idx) + size)
            })
            console.log('符合 bing 请求的地址:', imgSrcList)
        })
        .then(() => {
            createImg()
            download(0)
        })
}
imgLoad()

// 2. 创建 img 元素
function createImg() {
    const fragment = DOC.createDocumentFragment()
    imgSrcList.forEach((i) => {
        const img = DOC.createElement('img')
        img.src = i
        img.classList = 'img-item'
        fragment.appendChild(img)
    })
    slideContainer.appendChild(fragment)
    imgs = DOC.querySelectorAll('.img-item')
    imgLen = imgs.length
}

next.addEventListener('click', nextImg, false)
prev.addEventListener('click', prevImg, false)
slideContainer.addEventListener('click', showDetail, false)

// 单时隐藏 字体 和 trigger
function showDetail() {
    imgClick = !imgClick
    // 隐藏
    if (imgClick) {
        downTrigger.style.opacity = '0'
    } else {
        // 显示
        downTrigger.style.opacity = '1'
    }
}

function download(idx) {
    downloadBtn.href = imgSrcList[idx]
}

function nextImg() {
    nowNum < imgLen - 1 ? nowNum++ : false
    download(nowNum)
    let temp = -100 * nowNum + 'vw'
    slideContainer.style.transform = `translateX(${temp})`
}

function prevImg() {
    nowNum ? nowNum-- : false
    download(nowNum)
    let temp = -100 * nowNum + 'vw'
    slideContainer.style.transform = `translateX(${temp})`
}
