import React from 'react';
import App from './App';
import { getMockProvider } from './global/utils/tests/store.mock';
import * as service from './service/neo.service';
import actions from './global/utils/store/actions';
import { Cookies } from 'react-cookie';
import { cleanup } from '@testing-library/react';
import { Simulate } from 'react-dom/test-utils';

jest.mock('./components/comander/Comander.js', () => {
    return function MockComander() {
        return <div></div>
    }
});

service.doLogout = jest.fn();
service.getQuery = jest.fn();

describe('App cookies setted test suite', () => {
    let rendered;

    beforeEach(() => {
        const cookies = new Cookies();
        cookies.set('neo4jDash.sess', { sessionId: 'test' });
        ({ rendered } = getMockProvider(<App/>, { user: { loggedIn: false } }));
    })

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test("renders App if user is logged in", async () => {
        const { findByTestId } = rendered;

        const linkElement = await findByTestId("app");
        expect(linkElement).toBeDefined();
    });
});

describe('App user loggedIn test suite', () => {
    let rendered;
    let store;
    let act;

    beforeEach(() => {
        ({ rendered, store, act } = getMockProvider(<App/>, { user: { loggedIn: true }}));
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test("renders App if user is logged in", async () => {
        const { getByTestId } = rendered;
        const appElement = getByTestId('app');
        expect(appElement).toBeDefined();
    });

    test("trigger logout if user click logout button", async () => {
        const { findByTestId } = rendered;
        act(() => {
            store.dispatch(actions.user.logOut());
        })
        const linkElement = await findByTestId("login");
        expect(linkElement).toBeDefined();
    })
});

describe("App user not logged test suite", () => {
    let rendered;

    beforeEach(() => {
        ({ rendered } = getMockProvider(<App/>, { theme: {}, user: { loggedIn: false } }));
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test("renders login button if user is not logged in", async () => {
        const { getByText } = rendered;
        const linkElement = getByText("Login");
        expect(linkElement).toBeDefined();
    });
});

describe("App sidebar test suite", () => {
    let rendered;

    beforeEach(() => {
        ({ rendered } = getMockProvider(<App/>, { theme: {}, user: { loggedIn: true } }));
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    })

    test("sidebar render test", async () => {
        const { getByTestId, findByTestId } = rendered;
        const trigger = getByTestId('menu-trigger');
        Simulate.click(trigger);
        const element = await findByTestId('sidebar');
        expect(element).toBeDefined();
    })
});

