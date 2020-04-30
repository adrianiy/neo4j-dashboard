import { createStore } from "redux";
import rootReducer from "./reducers";

export const store = createStore(
    rootReducer,
    /* istanbul ignore next */
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);
