import React from 'react';
import { ColumnLayout, RowLayout } from "../../global/layouts";

import style from './Summary.module.css';

function Summary (props) {
    const renderLabels = (summary) => {
        if (!summary) {
            return null;
        }
        return Object.keys(summary.labels)
            .filter((key) => key !== "*")
            .map((key, idx) => {
                const styleForItem = props.graphStyle.forNode({
                    labels: [key],
                });
                return (
                    <RowLayout className={style.summary} dist="middle" key={idx}>
                        <span className={style.circle} style={{ backgroundColor: styleForItem.get('color') }}></span>
                        <span>{summary.labels[key].count}</span>
                        <span>{key}</span>
                    </RowLayout>
                )
            });
    }
    const renderRelations = summary => {
        if (!summary) {
            return null;
        }
        return Object.keys(summary.relTypes)
            .filter((key) => key !== "*")
            .map((key, idx) => {
                const styleForItem = props.graphStyle.forNode({
                    relTypes: [key],
                });
                return (
                    <RowLayout className={style.summary} dist="middle" key={idx}>
                        <span className={style.circle} style={{ backgroundColor: styleForItem.get("color") }}></span>
                        <span>{summary.relTypes[key].count}</span>
                        <span>{key}</span>
                    </RowLayout>
                );
            });
    }

    const renderProperties = item => {
        if (!item) {
            return null;
        }
        if (item.type !== 'canvas') {
            const styleForItem = item.type === 'node'  ? props.graphStyle.forNode({
                labels: item.item.labels,
            }) : props.graphStyle
            .forRelationship(item.item);
            const chipStyle = {
                backgroundColor: styleForItem.get('color'),
                color: styleForItem.get('text-color-internal')
            }
            return (
                <ColumnLayout dist="center" className={style.properties}>
                    <span className={style.chip} style={chipStyle}>{
                        item.type === 'node' ? item.item.labels.join(' ') : item.item.type
                    }</span>
                    {
                        item.item.properties.map((prop, idx) => (
                            <ColumnLayout dist="middle center spaced" className={style.property} key={idx}>
                                <strong>{ prop.key }</strong>
                                <span title={prop.value}>{ prop.value }</span>
                            </ColumnLayout>
                        ))
                    }
                </ColumnLayout>
            )
        }
        return null;
    }

    return (
        <ColumnLayout>
            { renderLabels(props.summary) }
            { renderRelations(props.summary) }
            { renderProperties(props.item) }
        </ColumnLayout>
    )
}

export default Summary;
