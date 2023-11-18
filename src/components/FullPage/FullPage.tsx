import React, { useEffect, useRef, useState } from 'react'
import animatedScrollTo from '../../utils/animated-scroll-to'
// import Controls from "../Controls/Controls";
import { IFullPageProps } from './interface'
import useIsMobile from '../../hooks/useIsMobile'

const scrollMode = {
  FULL_PAGE: 'full-page',
  NORMAL: 'normal',
}

const FullPage: React.FC<IFullPageProps> = ({
  afterChange = () => {},
  beforeChange = () => {},
  children,
  // controls,
  // controlsProps = {},
  duration = 700,
  initialSlide = 0,
  style,
  scrollMode: initialScrollMode = scrollMode.FULL_PAGE,
}) => {
  const currentActive = useRef<number>(initialSlide)
  const [activeSlide, setActiveSlide] = useState<number>(initialSlide)
  const [height, setHeight] = useState<number | undefined>(undefined)

  const slides = useRef<number[]>([])
  const [slidesCount, setSlidesCount] = useState<number>(0)

  const isScrollPending = useRef<boolean>(false)
  const isScrolledAlready = useRef<boolean>(false)
  const touchSensitivity = useRef<number>(5)
  const touchStart = useRef<number>(0)

  const isMobile = useIsMobile()

  useEffect(() => {
    if (isMobile) {
      document.addEventListener('touchmove', onTouchMove, { passive: false })
      document.addEventListener('touchstart', onTouchStart)
    } else {
      document.addEventListener('wheel', onScroll, { passive: false })
    }

    return () => {
      if (isMobile) {
        document.removeEventListener('touchmove', onTouchMove)
        document.removeEventListener('touchstart', onTouchStart)
      } else {
        document.removeEventListener('wheel', onScroll)
      }
      window.removeEventListener('resize', onResize)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const newSlidesCount = React.Children.count(children) || 1

    setSlidesCount(newSlidesCount)
    updateSlides()
    setHeight(window.innerHeight)

    if (newSlidesCount !== slidesCount) {
      const slidesDiff = slidesCount - newSlidesCount

      if (slidesDiff > 0 && activeSlide >= slidesCount - slidesDiff) {
        setActiveSlide(newSlidesCount - 1)
        currentActive.current = currentActive.current - 1
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onTouchMove = (ev: TouchEvent) => {
    if (initialScrollMode !== scrollMode.FULL_PAGE) {
      return
    }

    ev.preventDefault()
    const touchEnd = ev.changedTouches[0].clientY

    if (!isScrollPending.current && !isScrolledAlready.current) {
      if (touchStart.current > touchEnd + touchSensitivity.current) {
        scrollToSlide(activeSlide + 1)
      } else if (touchStart.current < touchEnd - touchSensitivity.current) {
        scrollToSlide(activeSlide - 1)
      }
    }
  }

  const onTouchStart = (ev: TouchEvent) => {
    touchStart.current = ev.touches[0].clientY
    isScrolledAlready.current = true
  }

  const onScroll = (ev: WheelEvent) => {
    if (initialScrollMode !== scrollMode.FULL_PAGE) {
      return
    }
    if (isScrollPending.current) {
      return
    }

    ev.preventDefault()

    const scrollDown = ev.deltaY > 0
    scrollToSlide(scrollDown ? currentActive.current + 1 : currentActive.current - 1)
  }

  const onResize = () => {
    updateSlides()
    setHeight(window.innerHeight)
  }

  const updateSlides = () => {
    slides.current = Array.from({ length: React.Children.count(children) || 1 }, (_, i) => window.innerHeight * i)
  }

  const scrollToSlide = (slide: number) => {
    if (!isScrollPending.current && slide >= 0 && slide < (React.Children.count(children) || 1)) {
      const currentSlide = activeSlide

      if (beforeChange) {
        beforeChange({ from: currentSlide, to: slide })
      }

      currentActive.current = slide
      isScrollPending.current = true

      animatedScrollTo(slides.current[slide], duration, () => {
        isScrollPending.current = false
        isScrolledAlready.current = true

        if (afterChange) {
          afterChange({ from: currentSlide, to: slide })
        }
      })
    }
  }

  // const controlsBasicProps = {
  //     getCurrentSlideIndex: () => activeSlide,
  //     onNext: () => {},
  //     onPrev: () => {},
  //     scrollToSlide,
  //     slidesCount: React.Children.count(children) || 1,
  // };

  return (
    <div style={{ height: height || 0, ...style }}>
      {/*{controls && (*/}
      {/*    <Controls*/}
      {/*        {...controlsBasicProps}*/}
      {/*        {...controlsProps}*/}
      {/*    />*/}
      {/*)}*/}
      {children}
    </div>
  )
}

export default FullPage
