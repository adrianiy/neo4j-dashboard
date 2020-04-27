export const DBPROPERTIES = 'SET_DB_PROPERTIES';

const dbSchema = (state = {}, action) => {
    switch (action.type) {
        case DBPROPERTIES:
            return {
                ...state,
                ...action.properties
            }
        default:
            return state;
    }
};

export default dbSchema;
