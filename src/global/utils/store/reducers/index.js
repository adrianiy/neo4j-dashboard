import user from "./user";
import theme from './theme';
import dbSchema from './db';
import graph from './graph';
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    user,
    theme,
    dbSchema,
    graph
});

export default rootReducer;
