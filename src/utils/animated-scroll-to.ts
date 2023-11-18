import easeInOutCubic from './ease-in-out-cubic'

const animatedScrollTo = (scrollTo: any, duration: any, callback: any) => {
  const scrollFrom = window.scrollY || window.pageYOffset || 0
  const scrollDiff = scrollTo - scrollFrom
  let currentTime = 0
  const increment = 20

  const animateScroll = () => {
    currentTime += increment
    const newScrollPos = easeInOutCubic(currentTime, scrollFrom, scrollDiff, duration)

    window.scrollTo(0, Math.floor(newScrollPos))

    if (currentTime > duration) {
      callback()
      return
    }

    setTimeout(animateScroll, increment)
  }

  animateScroll()
}

export default animatedScrollTo
