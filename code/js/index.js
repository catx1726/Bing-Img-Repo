function imgLoad() {
    // 1. 获取到 BING 的日推图片
    //'https://cn.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1', // 此接口需要用 nginx处理跨域请求
    // 备用 'https://api.berryapi.net/?service=App.Bing.Images'
    const DOC = document
    let pureImgSrc = ''
    let _d = new Date()
    let time = `${_d.getFullYear()}年${_d.getMonth() + 1}月${_d.getDate()}`
    fetch(
        'https://bing.adoba.site/proxy/bing/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=zh-CN'
    )
        .then((res) => res.json())
        .then((jsonRes) => {
            pureImgSrc = 'https://cn.bing.com/' + jsonRes.images[0].url
            DOC.querySelector('#bing-img-container').src = pureImgSrc
            console.log(
                `fetch ${time} bing-img jsonRes:`,
                jsonRes,
                ` and img-url:${pureImgSrc}`
            )
        })
}
imgLoad()
// 2. 调用放大图片接口
// 3. 保存图片到GitHub
// 4. 24H循环整个流程(附带检测如果有重名的就不放大，也不保存)
