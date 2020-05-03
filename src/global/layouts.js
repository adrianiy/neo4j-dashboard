import React from 'react';
import { cls } from "./utils";

export function RowLayout(props) {
    return (
        <div
            data-testid={props['data-testid']}
            className={cls( 'row', props.dist, props.className )}
            style={props.style}
            onClick={props.onClick}
        >
            { props.children }
        </div>
    )
}

export function ColumnLayout(props) {
    return (
        <div
            data-testid={props["data-testid"]}
            className={cls("column", props.dist, props.className)}
            style={props.style}
            onClick={props.onClick}
        >
            {props.children}
        </div>
    );
}
