import React from 'react';
import { getMockProvider } from '../../global/utils/tests/store.mock';
import { Simulate } from "react-dom/test-utils";
import Header from './Header';

describe('Header component test suite', () => {
    let rendered;
    let store;
    let toggleMenu = jest.fn()

    beforeEach(() => {
        ({ rendered, store } = getMockProvider(<Header toggleMenu={toggleMenu}/>,
            { theme: {}, user: { loggedIn: true } }));
    });

    test('should render component', () => {
        const { getByTestId } = rendered;
        const element = getByTestId('header');
        expect(element).toBeDefined();
    });

    test('should trigger logout', () => {
        const { getByTestId } = rendered;
        const logoutEl = getByTestId('logout');
        Simulate.click(logoutEl);
        expect(store.getState().user.user).toBe(null);
    });

    test('should toggle menu', () => {
        const { getByTestId } = rendered;
        const toggleEl = getByTestId('menu-trigger');
        Simulate.click(toggleEl);
        expect(toggleMenu).toHaveBeenCalled();
    })
})
