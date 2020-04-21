import React from 'react';
import { cls } from "./utils";

export function RowLayout(props) {
    return (
        <div className={cls( 'row', props.dist, props.className )} style={props.style}>
            { props.children }
        </div>
    )
}

export function ColumnLayout(props) {
    return (
        <div className={cls( 'column', props.dist, props.className )} style={props.style}>
            { props.children }
        </div>
    )
}
