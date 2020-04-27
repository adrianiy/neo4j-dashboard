import currentUser from "./user";
import currentTheme from './theme';
import dbSchema from './db';
import graph from './graph';
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    currentUser,
    currentTheme,
    dbSchema,
    graph
});

export default rootReducer;
