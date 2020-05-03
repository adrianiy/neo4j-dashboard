import React from 'react';
import { getMockProvider } from '../../global/utils/tests/store.mock';
import { cleanup } from "@testing-library/react";
import { Simulate } from "react-dom/test-utils";
import Sidebar from './Sidebar';
import actions from '../../global/utils/store/actions';

describe('Sidebar test suite', () => {
    let rendered;
    let store;

    beforeEach(() => {
        ({ rendered, store } = getMockProvider(<Sidebar/>, {
            theme: {},
            user: { loggedIn: true },
        }));
    });

    beforeEach(() => {
        store.dispatch(
            actions.db.setProperties({
                labels: { records: [{ get: () => "test" }] },
                relationshipTypes: { records: [{ get: () => "test" }] },
                propertyKeys: { records: [{ get: () => "test" }] },
            })
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    describe('render test suite', () => {
        test("Sidebar should render", () => {
            const { getByTestId } = rendered;
            const element = getByTestId("sidebar");
            expect(element).toBeDefined();
        });

        test("Sidebar should render settings", () => {
            const { getByTestId } = rendered;
            const toggler = getByTestId("settings-toggler");
            Simulate.click(toggler);
            const element = getByTestId("sidebar-settings");
            expect(element).toBeDefined();
        });

        test("Sidebar should render storage", () => {
            const { getByTestId } = rendered;
            const toggler = getByTestId("storage-toggler");
            Simulate.click(toggler);
            const element = getByTestId("sidebar-storage");
            expect(element).toBeDefined();
        });
    });

    describe('theme toggler test suite', () => {
        let togglers;

        beforeEach(() => {
            const { getAllByTestId } = rendered;
            togglers = getAllByTestId('toggler');
        });

        test('light theme toggler test', () => {
            Simulate.click(togglers[1]);
            expect(store.getState().theme['_id']).toBe('light');
            Simulate.click(togglers[1]);
            expect(store.getState().theme["_id"]).toBe("auto");
        });

        test("dark theme toggler test", () => {
            Simulate.click(togglers[2]);
            expect(store.getState().theme["_id"]).toBe("dark");
        });

        test('auto theme toggler test', () => {
            Simulate.click(togglers[0]);
            expect(store.getState().theme['_id']).toBe('auto');
        });

        test("small size theme toggler test", () => {
            Simulate.click(togglers[3]);
            expect(store.getState().theme["size"]).toBe("small");
            Simulate.click(togglers[3]);
            expect(store.getState().theme["size"]).toBe("wide");
        });

        test("wide size theme toggler test", () => {
            Simulate.click(togglers[4]);
            expect(store.getState().theme["size"]).toBe("wide");
            Simulate.click(togglers[4]);
            expect(store.getState().theme["size"]).toBe("small");
        });
    })
});

