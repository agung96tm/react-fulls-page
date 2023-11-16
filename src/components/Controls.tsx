import React from 'react';

interface ControlsProps {
    className?: string;
    getCurrentSlideIndex: () => number;
    onNext: () => void;
    onPrev: () => void;
    scrollToSlide: (slide: number) => void;
    slidesCount: number;
    style?: React.CSSProperties;
}

const Controls: React.FC<ControlsProps> = ({
    className = 'full-page-controls',
    getCurrentSlideIndex,
    onNext,
    onPrev,
    scrollToSlide,
    slidesCount,
    style = {},
}: ControlsProps) => {
    const renderSlidesNumbers = (currentSlideIndex: number) => {
        const slidesNumbers = [];

        for (let i = 0; i < slidesCount; i++) {
            const buttonProps = {
                disabled: currentSlideIndex === i,
                key: i,
                onClick: () => scrollToSlide(i),
            };

            slidesNumbers.push(<button type="button" {...buttonProps}>{i + 1}</button>);
        }

        return slidesNumbers;
    };

    const currentSlideIndex = getCurrentSlideIndex();

    return (
        <div className={className} style={style}>
            <button
                type="button"
                disabled={currentSlideIndex === 0}
                onClick={onPrev}
            >
                ←
            </button>
            {renderSlidesNumbers(currentSlideIndex)}
            <button
                type="button"
                disabled={currentSlideIndex === slidesCount - 1}
                onClick={onNext}
            >
                →
            </button>
        </div>
    );
};

export default Controls;