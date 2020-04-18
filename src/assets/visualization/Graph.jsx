import React, { Component } from "react";
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

export class GraphComponent extends Component {
    state = {
        zoomInLimitReached: true,
        zoomOutLimitReached: false,
    };

    graphInit(el) {
        this.svgElement = el;
    }

    zoomInClicked(el) {
        const limits = this.graphView.zoomIn(el);
        this.setState({
            zoomInLimitReached: limits.zoomInLimit,
            zoomOutLimitReached: limits.zoomOutLimit,
        });
    }

    zoomOutClicked(el) {
        const limits = this.graphView.zoomOut(el);
        this.setState({
            zoomInLimitReached: limits.zoomInLimit,
            zoomOutLimitReached: limits.zoomOutLimit,
        });
    }

    getVisualAreaHeight() {
        return this.props.frameHeight - dim.frameStatusbarHeight || this.svgElement.parentNode.offsetHeight;
    }

    componentDidMount() {
        if (this.svgElement != null) {
            this.initGraphView();
            this.graph && this.props.setGraph && this.props.setGraph(this.graph);
            this.props.getAutoCompleteCallback && this.props.getAutoCompleteCallback(this.addInternalRelationships);
            this.props.assignVisElement && this.props.assignVisElement(this.svgElement, this.graphView);
        }
    }

    initGraphView() {
        if (!this.graphView) {
            const NeoConstructor = graphView;
            const measureSize = () => {
                return {
                    width: this.svgElement.offsetWidth,
                    height: this.getVisualAreaHeight(),
                };
            };
            this.graph = createGraph(this.props.nodes, this.props.relationships);
            this.graphView = new NeoConstructor(this.svgElement, measureSize, this.graph, this.props.graphStyle);
            this.graphEH = new GraphEventHandler(
                this.graph,
                this.graphView,
                this.props.getNodeNeighbours,
                this.props.onItemMouseOver,
                this.props.onItemSelect,
                this.props.onGraphModelChange
            );
            this.graphEH.bindEventHandlers();
            this.props.onGraphModelChange(getGraphStats(this.graph));
            this.graphView.resize();
            this.graphView.update();
        }
    }

    addInternalRelationships = (internalRelationships) => {
        if (this.graph) {
            this.graph.addInternalRelationships(mapRelationships(internalRelationships, this.graph));
            this.props.onGraphModelChange(getGraphStats(this.graph));
            this.graphView.update();
            this.graphEH.onItemMouseOut();
        }
    };

    componentDidUpdate(prevProps) {
        if (prevProps.graphStyle.getVersion() !== this.props.graphStyle.getVersion()) {
            this.graphView.update();
        }
        if (this.props.fullscreen !== prevProps.fullscreen || this.props.frameHeight !== prevProps.frameHeight) {
            this.graphView.resize();
        }
    }

    render() {
        return (
            <StyledSvgWrapper>
                <svg className="neod3viz" ref={this.graphInit.bind(this)} />
            </StyledSvgWrapper>
        );
    }
}
