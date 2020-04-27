import { SETGRAPHSTYLE, SETSELECTORSTYLE } from "../reducers/graph"


const updateStyle = (rules) => {
    return {
        type: SETGRAPHSTYLE,
        rules
    }
}

const updateSelector = (selector, rules) => {
    return {
        type: SETSELECTORSTYLE,
        selector,
        rules
    }
}

export default {
    updateStyle,
    updateSelector
}
