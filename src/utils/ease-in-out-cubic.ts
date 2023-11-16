const easeInOutCubic = (currentTime: any, startValue: any, changeInValue: any, duration: any) => {
    const time = (currentTime / duration) - 1;
    const timeCubic = time * time * time;
    return (changeInValue * (timeCubic + 1)) + startValue;
};

export default easeInOutCubic;