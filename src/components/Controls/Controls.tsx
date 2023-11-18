import React from 'react'
import { ControlsProps } from './interface'

const Controls: React.FC<ControlsProps> = ({
  className = 'full-page-controls',
  getCurrentSlideIndex,
  onNext,
  onPrev,
  scrollToSlide,
  slidesCount,
  style = {},
}: ControlsProps) => {
  const currentSlideIndex = getCurrentSlideIndex()

  return (
    <div className={className} style={style}>
      <button type='button' disabled={currentSlideIndex === 0} onClick={onPrev}>
        ←
      </button>

      {new Array(slidesCount).fill(null).map((_, index) => (
        <button type='button' key={index} disabled={currentSlideIndex === index} onClick={() => scrollToSlide(index)}>
          {index + 1}
        </button>
      ))}

      <button type='button' disabled={currentSlideIndex === slidesCount - 1} onClick={onNext}>
        →
      </button>
    </div>
  )
}

export default Controls
