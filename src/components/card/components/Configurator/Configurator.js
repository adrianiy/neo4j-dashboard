import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { cls } from '../../../../global/utils';
import actions from '../../../../global/utils/store/actions';
import { ColumnLayout, RowLayout } from '../../../../global/layouts';

import styles from './Configurator.module.css'

function Configurator(props) {
    const graphStyle = useSelector(state => state.graph);
    const dispatch = useDispatch();

    const updateStyle = (selector, styleProp) => {
        dispatch(actions.graph.updateSelector(selector, styleProp));
    }

    const renderPropSelector = (defaultProps, className, activeProp, title, style) => {
        return defaultProps.map((prop, i) => {
            const onClick = () => {
                updateStyle(props.styleForItem.selector, prop);
            };
            return (
                <div
                    key={i}
                    className={cls(className, activeProp(prop))}
                    title={title(prop)}
                    onClick={onClick}
                    style={style(prop, i)}
                ></div>
            );
        });
    }

    const renderCaptionSelector = (defaultCaptions, className, activeCaption) => {
        return Object.entries(defaultCaptions).map((cap, i) => {
            const onClick = () => {
                updateStyle(props.styleForItem.selector, {
                    caption: cap[0].startsWith('<') ? cap[0] : `{${cap[0]}}`
                });
            };
            return (
                <div
                    key={i}
                    className={cls(className, activeCaption(cap[0]))}
                    onClick={onClick}
                >{ cap[0] }</div>
            )
        })
    }

    const renderNodeConfig = () => {
        return (
            <ColumnLayout dist="left">
                <ColumnLayout className={styles.configWrapper}>
                    <strong>Sizes</strong>
                    <RowLayout dist="left middle spaced" className={styles.configContainer}>
                        {renderPropSelector(
                            graphStyle.defaultSizes(),
                            styles.circle,
                            (prop) => (prop.diameter === props.styleForItem.get("diameter") ? styles.circleActive : ""),
                            (prop) => prop.diameter,
                            (prop, i) => ({ width: (i + 1) * 3, height: (i + 1) * 3 })
                        )}
                    </RowLayout>
                </ColumnLayout>
                <ColumnLayout className={styles.configWrapper}>
                    <strong>Colors</strong>
                    <RowLayout dist="left middle spaced wrap" className={styles.configContainer}>
                        {renderPropSelector(
                            graphStyle.defaultColors(),
                            styles.colorCircle,
                            (prop) => (prop.color === props.styleForItem.get("color") ? styles.colorActive : ""),
                            (prop) => prop.color,
                            (prop, _) => ({ background: prop.color })
                        )}
                    </RowLayout>
                </ColumnLayout>
                <ColumnLayout className={styles.configWrapper}>
                    <strong>Properties</strong>
                    <ColumnLayout dist="left middle spaced wrap" className={styles.propertiesContainer}>
                        {renderCaptionSelector(props.properties, styles.property, (prop) =>
                            props.styleForItem.get("caption").includes(prop) ? styles.propertyActive : ""
                        )}
                    </ColumnLayout>
                </ColumnLayout>
            </ColumnLayout>
        );
    }

    const renderRelConfig = () => {
        return (
            <ColumnLayout dist="left">
                <ColumnLayout className={styles.configWrapper}>
                    <strong>Line width</strong>
                    <RowLayout dist="left middle spaced" className={styles.configContainer}>
                        {renderPropSelector(
                            graphStyle.defaultArrayWidths(),
                            styles.line,
                            (prop) =>
                                prop["shaft-width"] === props.styleForItem.get("shaft-width") ? styles.lineActive : "",
                            (prop) => prop.color,
                            (prop, i) => ({ height: prop["shaft-width"] })
                        )}
                    </RowLayout>
                </ColumnLayout>
                <ColumnLayout className={styles.configWrapper}>
                    <strong>Color</strong>
                    <RowLayout dist="left middle spaced wrap" className={styles.configContainer}>
                        {renderPropSelector(
                            graphStyle.defaultColors(),
                            styles.lineColor,
                            (prop) => (prop.color === props.styleForItem.get("color") ? styles.lineActive : ""),
                            (prop) => prop["color"],
                            (prop, _) => ({ background: prop.color })
                        )}
                    </RowLayout>
                </ColumnLayout>
                <ColumnLayout className={styles.configWrapper}>
                    <strong>Properties</strong>
                    <ColumnLayout dist="left middle spaced wrap" className={styles.propertiesContainer}>
                        {renderCaptionSelector(props.properties, styles.property, (prop) =>
                            props.styleForItem.get("caption").includes(prop) ? styles.propertyActive : ""
                        )}
                    </ColumnLayout>
                </ColumnLayout>
            </ColumnLayout>
        );
    }

    return  props.type === 'node'
        ? renderNodeConfig()
        : props.type === 'rel'
            ? renderRelConfig()
            : null
}

export default Configurator;
