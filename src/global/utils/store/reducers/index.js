import currentUser from "./user";
import currentTheme from './theme';
import dbSchema from './db';
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    currentUser,
    currentTheme,
    dbSchema
});

export default rootReducer;
