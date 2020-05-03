import React from "react";
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";

export const getMockProvider = (partialState) => {
    const mockStore = configureStore();
    const store = mockStore({
        theme: {},
        user: { user: null, loggedIn: false }
    });

    return {
        MockProvider: ({ children }) => <Provider store={store}>{children}</Provider>,
        store,
    };
};

export const setup = (partialState) => {
    const { MockProvider } = getMockProvider(partialState);

    // the other mocking you want to do like a custom hook

    return {
        MockProvider,
        // you can return all mock instance from here, so you assert then in the tests
    };
};
