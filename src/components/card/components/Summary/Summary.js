import React, { useState } from 'react';
import { ColumnLayout, RowLayout } from "../../../../global/layouts";

import style from './Summary.module.css';
import Configurator from '../Configurator/Configurator';
import { useSelector } from 'react-redux';
import { cls } from '../../../../global/utils';

function Summary (props) {
    const [configItem, setConfigItem] = useState(null);
    const graphStyle = useSelector(state => state.graph);

    const handleConfigItem = item => {
        if (configItem && configItem.label === item.label) {
            setConfigItem(null);
        } else {
            setConfigItem(item);
        }
    }

    const renderLabels = (summary) => {
        if (!summary) {
            return null;
        }

        return Object.keys(summary.labels)
            .filter((key) => key !== "*")
            .map((key, idx) => {
                const styleForItem = graphStyle.forNode({
                    labels: [key],
                });
                return (
                    <RowLayout
                        className={cls(
                            style.summary,
                            configItem && configItem.label === key ? style.summaryActive : ""
                        )}
                        dist="middle"
                        key={idx}
                        onClick={() =>
                            handleConfigItem({ type: "node", label: key, properties: summary.labels[key].properties })
                        }
                    >
                        <span className={style.circle} style={{ backgroundColor: styleForItem.get("color") }}></span>
                        <span>{summary.labels[key].count}</span>
                        <span>{key}</span>
                    </RowLayout>
                );
            });
    }
    const renderRelations = summary => {
        if (!summary) {
            return null;
        }
        return Object.keys(summary.relTypes)
            .filter((key) => key !== "*")
            .map((key, idx) => {
                const styleForItem = graphStyle.forRelationship({
                    relTypes: [key],
                });
                return (
                    <RowLayout
                        className={cls(
                            style.summary,
                            configItem && configItem.label === key ? style.summaryActive : ""
                        )}
                        dist="middle"
                        key={idx}
                        onClick={() =>
                            handleConfigItem({
                                type: "rel",
                                label: key,
                                properties: {
                                    ...{ '<id>': null, '<type>': null },
                                    ...summary.relTypes[key].properties
                                }
                            })
                        }
                    >
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
            const styleForItem = item.type === 'node'  ? graphStyle.forNode({
                labels: item.item.labels,
            }) : graphStyle
            .forRelationship(item.item);
            const chipStyle = {
                backgroundColor: styleForItem.get('color'),
                color: styleForItem.get('text-color-internal')
            }
            return (
                <ColumnLayout dist="left" className={style.properties}>
                    <span className={style.chip} style={chipStyle}>{
                        item.type === 'node' ? item.item.labels.join(' ') : item.item.type
                    }</span>
                    {
                        item.item.properties.map((prop, idx) => (
                            <ColumnLayout dist="middle left spaced" className={style.property} key={idx}>
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

    const renderConfigurator = () => {
        if (!configItem) {
            return null;
        }
        const { type, label, properties } = configItem;
        const styleForItem = graphStyle[ type === 'node' ? 'forNode' : 'forRelationship']({
            [type === 'node' ? 'labels' : 'relTypes']: [label],
        });
        const chipStyle = {
            backgroundColor: styleForItem.get("color"),
            color: styleForItem.get("text-color-internal"),
        };

        return (
            <ColumnLayout dist="left" className={style.properties}>
                <span className={style.chip} style={chipStyle}>
                    {label}
                </span>
                <Configurator type={type} styleForItem={styleForItem} update={props.update} properties={properties}/>
            </ColumnLayout>
        );
    }

    return (
        <ColumnLayout dist="left">
            { renderLabels(props.summary) }
            { renderRelations(props.summary) }
            { renderProperties(props.item) }
            { renderConfigurator() }
        </ColumnLayout>
    )
}

export default Summary;
