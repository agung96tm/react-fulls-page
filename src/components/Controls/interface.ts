import React from "react";

export interface ControlsProps {
    className?: string;
    getCurrentSlideIndex: () => number;
    onNext: () => void;
    onPrev: () => void;
    scrollToSlide: (slide: number) => void;
    slidesCount: number;
    style?: React.CSSProperties;
}