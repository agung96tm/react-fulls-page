import {ISlideProps} from "./interface";
import React from "react";

const Slide: React.FC<ISlideProps> = (props: any) => {
    const { children, style, ..._props } = props;
    return (
        <div {..._props} style={{ ...style, height: '100%'}}>
            {children}
        </div>
    )
}

export default Slide;