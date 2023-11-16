import React, {useEffect, useRef, useState} from "react";
import animatedScrollTo from "../utils/animated-scroll-to";
import Controls from "./Controls";
import isMobileDevice from "../utils/is-mobile";

const scrollMode = {
    FULL_PAGE: 'full-page',
    NORMAL: 'normal',
};

const FullPage = ({
    afterChange = () => {},
    beforeChange = () => {},
    children,
    controls,
    controlsProps = {},
    duration = 700,
    initialSlide = 0,
    scrollMode: initialScrollMode = scrollMode.FULL_PAGE,
}: any) => {
    const [activeSlide, setActiveSlide] = useState<number>(initialSlide);
    const [slidesCount, setSlidesCount] = useState<number>(0);
    const [height, setHeight] = useState<number | undefined>(undefined);

    const isMobile = useRef<boolean | null>(null);
    const isScrollPending = useRef<boolean>(false);
    const isScrolledAlready = useRef<boolean>(false);
    const slides = useRef<number[]>([]);
    const touchSensitivity = useRef<number>(5);
    const touchStart = useRef<number>(0);

    const getChildrenCount = (children: any): number => {
        const childrenArr = React.Children.toArray(children);
        // const slides = childrenArr.filter(({ type }: any) => type === Slide);
        return childrenArr.length || 1;
    };

    const updateSlides = () => {
        slides.current = Array.from({ length: slidesCount }, (_, i) => window.innerHeight * i);
    };

    const onTouchStart = (evt: TouchEvent) => {
        touchStart.current = evt.touches[0].clientY
        isScrolledAlready.current = true
    }

    const onTouchMove = (evt: TouchEvent) => {
        if (initialSlide !== scrollMode.FULL_PAGE) {
            return;
        }

        evt.preventDefault();
        const touchEnd = evt.changedTouches[0].clientY;

        if (!isScrollPending.current && !isScrolledAlready.current) {
            if (touchStart.current > touchEnd + touchSensitivity.current) {
                scrollToSlide(activeSlide + 1);
            } else {
                scrollToSlide(activeSlide  - 1);
            }
        }
    }

    const onScroll = (evt: WheelEvent) => {
        if (initialScrollMode !== scrollMode.FULL_PAGE) {
            return;
        }

        evt.preventDefault();
        if (isScrollPending.current) {
            return;
        }

        const scrollDown = evt.deltaY > 0;
        let newActiveSlide = activeSlide;

        if (scrollDown) {
            newActiveSlide++;
        } else {
            newActiveSlide--;
        }

        scrollToSlide(newActiveSlide);
    };

    const scrollToSlide = (slide: number) => {
        if (!isScrollPending.current && slide >= 0 && slide < slidesCount) {
            const currentSlide = activeSlide;

            if (beforeChange) {
                beforeChange({ from: currentSlide, to: slide });
            }

            setActiveSlide(slide);
            isScrollPending.current = true;

            animatedScrollTo(slides.current[slide], duration, () => {
                isScrollPending.current = false;
                isScrolledAlready.current = true;

                if (afterChange) {
                    afterChange({ from: currentSlide, to: slide });
                }
            });
        }
    };

    const renderControls = () => {
        if (!controls) {
            return null;
        }

        const controlsBasicProps = {
            getCurrentSlideIndex: () => activeSlide,
            onNext: () => scrollToSlide(activeSlide + 1),
            onPrev: () => scrollToSlide(activeSlide - 1),
            scrollToSlide,
            slidesCount,
        };

        if (controls === true) {
            return (
                <Controls
                    className="full-page-controls"
                    {...controlsBasicProps}
                    {...controlsProps}
                />
            );
        }

        const CustomControls = controls as React.ComponentType<any>;
        return (
            <CustomControls {...controlsBasicProps} {...controlsProps} />
        );
    };


    useEffect(() => {
        isMobile.current = isMobileDevice();

        const touchMoveListener = (event: TouchEvent) => onTouchMove(event);
        const wheelListener = (event: WheelEvent) => onScroll(event);

        if (isMobile.current) {
            document.addEventListener('touchmove', touchMoveListener, { passive: false });
            document.addEventListener('touchstart', onTouchStart);
        } else {
            document.addEventListener('wheel', wheelListener, { passive: false });
        }

        return () => {
            if (isMobile.current) {
                document.removeEventListener('touchmove', touchMoveListener);
                document.removeEventListener('touchstart', onTouchStart);
            } else {
                document.removeEventListener('wheel', wheelListener);
            }

            window.removeEventListener('resize', onResize);
        };
    }, [activeSlide, slidesCount, initialScrollMode]);

    useEffect(() => {
        const newSlidesCount = getChildrenCount(children);

        setSlidesCount(newSlidesCount);
        updateSlides();
        setHeight(window.innerHeight);

        if (newSlidesCount !== slidesCount) {
            const slidesDiff = slidesCount - newSlidesCount;

            if (slidesDiff > 0 && activeSlide >= slidesCount - slidesDiff) {
                setActiveSlide(newSlidesCount - 1);
            }
        }
    }, [children]);

    const onResize = () => {
        updateSlides();
        setHeight(window.innerHeight);
    };

    return (
        <div style={{ height }}>
            {renderControls()}
            {children}
        </div>
    );
}

export default FullPage;