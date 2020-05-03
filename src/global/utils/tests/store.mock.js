import React from "react";
import { Provider } from "react-redux";
import { render, act } from "@testing-library/react";
import rootReducer from "../store/reducers";
import { createStore } from "redux";

export const getMockProvider = (children, partialState, spyDispatch = false) => {
    const store = createStore(rootReducer, partialState);
    let storeSpy;
    if (spyDispatch) {
        storeSpy = jest.spyOn(store, 'dispatch').mockImplementation(() => jest.fn());
    }
    const rendered = render(<Provider store={store}>
        {children}
    </Provider>);

    return {
        rendered,
        store,
        act,
        storeSpy
    }
};
