import React from 'react';

const Slide = (props: any) => (
    <div {...props} style={{ ...props.style, height: '100%' }}>
        {props.children}
    </div>
);

export default Slide;
