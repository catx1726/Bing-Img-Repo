document.addEventListener('DOMContentLoaded', handleLoaded)

window.onload = function () {
  if (!domLoaded) return
  console.log('window onload need sleep!')
  // 动态资源没加载完毕
  setTimeout(() => {
    console.log('window onload ok!')
    return handlePreloader()
  }, 1000)
}

function handleLoaded() {
  console.log('handlePreloader!')
  handlePreloader()
}

function handlePreloader() {
  let loadedDOM = DOC.querySelector('.preloader'),
    mainDOM = DOC.querySelector('.main_container')
  loadedDOM.classList.toggle('left-in')
  mainDOM.classList.remove('hide')
}
