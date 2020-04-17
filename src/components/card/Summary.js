import React from 'react';
import { ColumnLayout, RowLayout } from "../../global/layouts";

import style from './Summary.module.css';

function Summary (props) {
    const getNodeQuantity = (nodes) => {
        return nodes.filter((node, index) => nodes.filter((n, idx) => node.id === n.id && index !== idx).length).length + 1;
    }

    return (
        <ColumnLayout>
            <RowLayout dist="middle">
                <span className={style.circle}></span>
                <span>{ getNodeQuantity(props.nodes) }</span>
                <span>Articulos</span>
            </RowLayout>
        </ColumnLayout>
    )
}

export default Summary;
