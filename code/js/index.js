const DOC = document,
  WINDOW = window,
  _d = new Date()

let createDomSendObj = { classList: [], parentBox: {}, attrName: [], valueList: [], domType: [{}] }

// 基本交互的一些数据
let imgs = '',
  imgContainer = DOC.querySelector('.img_container'),
  slideContainer = DOC.querySelector('.slide_container'),
  prev = DOC.querySelector('.prev'),
  next = DOC.querySelector('.next'),
  downloadBtn = DOC.querySelector('.button-down'),
  downTrigger = DOC.querySelector('.trigger-down'),
  miniSlideContainer = DOC.querySelector('.mini_slide_container'),
  imgLen = 0, // imgs 总数量
  nowNum = 0, // 当前第几张
  imgClick = false,
  pastNum = 0, // 存储之前那张的IDX，
  domLoaded = false // 当所有图片加载完毕之后，显示页面

// 获取当前 year / month 用于请求使用
let nowYear = _d.getFullYear(),
  nowMonth = _d.getMonth() + 1

// 传递格式 https://test.dev.adoba.site/public/bing/2020/05/
nowMonth = nowMonth <= 9 ? '0' + nowMonth : nowMonth

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

// 1. 获取到当月的图片
function imgLoad() {
  let urlList = []
  fetch(`https://dev.adba.club/public/bing/${nowYear}/${nowMonth}/`)
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
      createDomSendObj = {
        domType: 'img',
        valueList: imgSrcList,
        attrName: ['src']
      }
      createDom(createDomSendObj, slideContainer, 'img-item')
      createDom(createDomSendObj, miniSlideContainer, 'mini_item')
      miniItemClickReg(miniSlideContainer)
      download(0)
      handleCheckImgsLoaded()
    })
}
imgLoad()

function handleCheckImgsLoaded() {
  let imgsPromiseAll = []
  imgs.forEach((i, index) => {
    imgsPromiseAll[index] = new Promise((resolve, reject) => {
      i.onload = () => {
        return resolve()
      }
    })
  })
  Promise.all(imgsPromiseAll).then(() => {
    domLoaded = true
    handlePreloader()
  })
}

/**
 *
 * @des 生成DOM元素
 * @param {Object} obj{domType:'',valueList:[],attrName:[]}
 * @param {Object} parentBox
 * @param {String} mClass
 *
 */
function createDom(obj, parentBox, mClass) {
  const fragment = DOC.createDocumentFragment()
  let { domType, valueList, attrName } = obj

  valueList.forEach((i) => {
    const img = DOC.createElement(domType)
    attrName.forEach((myAttr) => {
      img[myAttr] = i
    })
    img.classList = mClass
    fragment.appendChild(img)
  })
  parentBox.appendChild(fragment)
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
    miniSlideContainer.style.opacity = '0'
    imgContainer.style.top = '5vh'
  } else {
    // 显示
    downTrigger.style.opacity = '1'
    miniSlideContainer.style.opacity = '1'
    imgContainer.style.top = '0'
  }
}

function download(idx) {
  let temp4K = imgSrcList[idx].split('=')[1]
  // downloadBtn.href = `https://dev.adoba.site/public/bing/${nowYear}/${nowMonth}/4k/${temp4K}`
}

function nextImg() {
  nowNum = nowNum < imgLen - 1 ? nowNum + 1 : 0
  download(nowNum)
  slidTrigger()
}

function prevImg() {
  nowNum = nowNum ? nowNum - 1 : imgLen - 1
  download(nowNum)
  slidTrigger()
}

function slidTrigger() {
  console.log('slideTrigger numNum:', nowNum)
  let temp = -100 * nowNum + 'vw',
    miniTemp = -10 * nowNum - 10 + '%'
  slideContainer.style.transform = `translateX(${temp})`
  miniSlideContainer.style.transform = `translateX(${miniTemp})`
  if (nowNum < 5) {
    miniSlideContainer.style.transform = `translateX(-50%)`
  }
}

// mini_item 事件绑定
/**
 *
 * @des 给所有 mini_item 添加监听
 * @param {Object} domContainer
 */
function miniItemClickReg(domContainer) {
  let miniItems = [...domContainer.children]
  miniItems.forEach((i) => {
    i.addEventListener('click', () => {
      let idx = imgSrcList.indexOf(i.src)
      miniItemClick(idx)
    })
  })
}

// click mini item 时获取到 IDX 赋值给 nowNum
function miniItemClick(value) {
  nowNum = value
  nextImg()
  prevImg()
}
