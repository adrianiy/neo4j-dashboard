import React, { useEffect, useCallback, useRef, useState } from "react";
import { createGraph, mapRelationships, getGraphStats } from "./mapper";
import { GraphEventHandler } from "./GraphEventHandler";
import { StyledSvgWrapper, StyledZoomHolder, StyledZoomButton, StyledZoomIcon } from "./styled";
import graphView from "./components/graphView";

import * as d3 from "d3";
import { cls } from "../../global/utils";

const dim = {
    // Editor bar
    editorbarHeight: 71,
    // Frame
    frameBodyHeight: 550,
    frameTitlebarHeight: 39,
    frameStatusbarHeight: 39,
    frameBodyPadding: 20,
};

d3.selection.enter.prototype.appendSVG = function (SVGString) {
    return this.select(function () {
        return this.appendChild(
            document.importNode(
                new DOMParser().parseFromString(SVGString, "application/xml").documentElement.firstChild,
                true
            )
        );
    });
};

function GraphComponent(props) {
    const [svgElement, setSvgElement] = useState(null);
    const [zoomInLimitReached, setZoomInLimitReached] = useState(true);
    const [zoomOutLimitReached, setZoomOutLimitReached] = useState(false);
    const _graph = useRef(null);
    const _graphView = useRef(null);
    const _graphEH = useRef(null);

    const addInternalRelationships = useCallback((internalRelationships) => {
        if (_graph.current) {
            _graph.current.addInternalRelationships(mapRelationships(internalRelationships, _graph.current));
            props.onGraphModelChange(getGraphStats(_graph.current));
            _graphView.current.update();
            _graphEH.current.onItemMouseOut();
        }
    }, [props]);

    const getVisualAreaHeight = useCallback(() => {
        return props.frameHeight - dim.frameStatusbarHeight || svgElement.parentNode.offsetHeight;
    }, [props.frameHeight, svgElement])

    const initGraphView = useCallback(() => {
        if (!_graphView.current) {
            const NeoConstructor = graphView;
            const measureSize = () => {
                return {
                    width: svgElement.offsetWidth,
                    height: getVisualAreaHeight(),
                };
            };
            _graph.current = createGraph(props.nodes, props.relationships);
            _graphView.current = new NeoConstructor(svgElement, measureSize, _graph.current, props.graphStyle);
            _graphEH.current = new GraphEventHandler(
                _graph.current,
                _graphView.current,
                props.getNodeNeighbours,
                props.onItemMouseOver,
                props.onItemSelect,
                props.onGraphModelChange
            );
            _graphEH.current.bindEventHandlers();
            props.onGraphModelChange(getGraphStats(_graph.current));
            _graphView.current.resize();
            _graphView.current.update();
        }
        _graph.current && props.setGraph && props.setGraph(_graph.current);
        props.getAutoCompleteCallback && props.getAutoCompleteCallback(addInternalRelationships);
        props.assignVisElement && props.assignVisElement(svgElement, _graphView.current);
    }, [getVisualAreaHeight, addInternalRelationships, props, svgElement]);

    useEffect(() => {
        if (svgElement) {
            initGraphView();
        }
    }, [svgElement, initGraphView]);

    useEffect(() => {
        if (_graphView.current) {
            _graphView.current.update();
        }
    }, [props.graphStyle.version]);

    useEffect(() => {
        if (_graphView.current) {
            _graphView.current.resize();
        }
    }, [props.fullscreen, props.frameHeight]);

    const zoomInClicked = (el) => {
        const limits = _graphView.current.zoomIn(el)
        setZoomInLimitReached(limits.zoomInLimit);
        setZoomOutLimitReached(limits.zoomOutLimit);
    }

    const zoomOutClicked = (el) => {
        const limits = _graphView.current.zoomOut(el)
        setZoomInLimitReached(limits.zoomInLimit);
        setZoomOutLimitReached(limits.zoomOutLimit);
    }

    const zoomButtons = () => {
        if (props.fullscreen || props.zoomEnabled) {
            return (
                <StyledZoomHolder>
                    <StyledZoomButton onClick={zoomInClicked}>
                        <StyledZoomIcon className={cls(zoomInLimitReached ? "disabled" : "", "material-icons")}>
                            zoom_in
                        </StyledZoomIcon>
                    </StyledZoomButton>
                    <StyledZoomButton onClick={zoomOutClicked}>
                        <StyledZoomIcon className={cls(zoomOutLimitReached ? "disabled" : "", "material-icons")}>
                            zoom_out
                        </StyledZoomIcon>
                    </StyledZoomButton>
                </StyledZoomHolder>
            );
        }
        return null
    }

    return (
        <StyledSvgWrapper>
            <svg className="neod3viz" ref={el => setSvgElement(el)} />
             {zoomButtons()}
        </StyledSvgWrapper>
    );
}

export default GraphComponent;
