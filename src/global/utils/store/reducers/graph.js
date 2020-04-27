import neoGraphStyle from "../../../components/chart/graphStyle";
import deepmerge from "deepmerge";

export const SETGRAPHSTYLE = "SET_GRAPH_STYLE";
export const SETSELECTORSTYLE = "SET_SELECTOR_STYLE";

const graphStyle = neoGraphStyle();

const currentGraph = (state = graphStyle, action) => {
    switch(action.type) {
        case SETGRAPHSTYLE:
            const rebasedStyle = deepmerge(graphStyle.toSheet(), action.rules);
            graphStyle.loadRules(rebasedStyle);
            graphStyle.update();
            return graphStyle;
        case SETSELECTORSTYLE:
            graphStyle.changeForSelector(action.selector, action.rules);
            graphStyle.update();
            return graphStyle;
        default:
            return state;
    }
};

export default currentGraph;
