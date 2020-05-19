/* 
    放大图片的方法，将 main 中的今日图片 name 拿到这边
    拼接成 https://cn.bing.com/th?id=${name}_1920x1080.jpg 形式
    然后调用 Bigjpg 的API，然后保存其 task_id
    定时调用 Bigjpg 的用来检测 task 是否完成的 API 
    如果完成 则保存其 图片地址 进行下载到本地，然后指定好 express 请求
*/
