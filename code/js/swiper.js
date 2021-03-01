function handleSwiper() {
  console.log('swiper js running!')
  const swiper = new Swiper('.swiper-container', {
    // Optional parameters
    direction: 'horizontal',
    loop: true,
    // Navigation arrows
    navigation: {
      nextEl: '.next',
      prevEl: '.prev'
    }
  })
}
