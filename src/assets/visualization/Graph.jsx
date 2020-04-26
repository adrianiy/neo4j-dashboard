import React, { useEffect, useCallback, useRef, useState } from "react";
import { createGraph, mapRelationships, getGraphStats } from "./mapper";
import { GraphEventHandler } from "./GraphEventHandler";
import { StyledSvgWrapper } from "./styled";
import graphView from "./components/graphView";

import * as d3 from "d3";

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
    }, [props.fullscreen, props.frameHeight])

    return (
        <StyledSvgWrapper>
            <svg className="neod3viz" ref={el => setSvgElement(el)} />
        </StyledSvgWrapper>
    );
}

export default GraphComponent;
