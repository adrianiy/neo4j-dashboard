import { DBPROPERTIES } from "../reducers/db"

const setProperties = (properties) => {
    return {
        type: DBPROPERTIES,
        properties
    }
}

export default {
    setProperties
}
