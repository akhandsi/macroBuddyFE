import {RectangleProps} from "recharts";
import React from "react";

/**
 * Shadow bar shows current advice in the bar.
 *
 * @param props RectangleProps
 */
const ShadowBarShape = (props: RectangleProps) => {
    const {x, y, width, height} = props;
    if (x !== undefined && y !== undefined && width !== undefined && height !== undefined) {
        return (
            <g>
                <path d={`M ${x + 4},${y} h ${width} v ${height} h ${-width} Z`} fill="#fff" opacity={0.1}/>
            </g>
        );
    }
    return null;
};

export default ShadowBarShape;
