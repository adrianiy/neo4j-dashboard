import currentUser from "./user";
import currentTheme from './theme';
import { combineReducers } from "redux";

const rootReducer = combineReducers({
    currentUser,
    currentTheme
});

export default rootReducer;
