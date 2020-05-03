import React from "react";
import { getMockProvider } from "../../global/utils/tests/store.mock";
import { Simulate } from "react-dom/test-utils";
import * as utils from "../../global/utils";
import Comander from "./Comander";
import { waitFor, cleanup } from "@testing-library/react";
import actions from "../../global/utils/store/actions";
import * as cypher from "./cypher/common";

global.fetch = () => jest.fn();

jest.mock('cypher-codemirror', () => ({ createCypherEditor: () => ({
        editor: { on: jest.fn(), setValue: jest.fn(), setOption: jest.fn(), lineCount: jest.fn(), setCursor: jest.fn() },
        editorSupport: { setSchema: jest.fn() }
    })
}));

jest.mock("./../timeline/Timeline.js", () =>
    (props) => (
        <div
            data-testid={props['data-testid']}
            queries={props.queries}
            onChange={(ev) =>
                ev.target.method === "delete" ? props.deleteQuery(ev.target.value) : props.selectQuery(null, ev.target.value)
            }
        ></div>
    )
);

describe('Comander component test suite', () => {
    let rendered;
    let store;

    beforeEach(() => {
        ({ rendered, store } = getMockProvider(<Comander options={{}}/>,
            { theme: {}, user: { loggedIn: true } }));
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test('should render component', () => {
        const { getByTestId } = rendered;
        const element = getByTestId('comander');
        expect(element).toBeDefined();
    });

    test('should load dbSchema', async () => {
        const spy = jest.spyOn(cypher, 'toSchema').mockImplementation(() => []);
        store.dispatch(actions.db.setProperties({ labels: 'test' }));
        await waitFor(() => expect(spy).toHaveBeenCalled())
    });

    test('handlePlay test', async () => {
        jest.spyOn(utils, 'concatUniqueStrings').mockImplementation(() => [ 'test' ])
        const spy = jest.spyOn(window.localStorage.__proto__, "setItem").mockImplementation(() => jest.fn());
        const { getByTestId } = rendered;
        const trigger = getByTestId('play-trigger');
        Simulate.click(trigger);
        await waitFor(() => expect(spy).toHaveBeenCalled());
    });

    test('showStored test', async () => {
        const { getByTestId, findByTestId } = rendered;
        const trigger = getByTestId('stored-trigger');
        Simulate.click(trigger);
        const element = await findByTestId('show-stored');
        expect(element.className.includes('listActive')).toBeTruthy();
    });
});

describe('Comander queries test suite', () => {
    let rendered;
    let spy = jest.fn();

    beforeEach(() => {
        jest.spyOn(window.localStorage.__proto__, "getItem").mockImplementation(() => ["test"]);
        JSON.parse = spy.mockImplementation(() => ["test"]);
        ({ rendered } = getMockProvider(<Comander options={{}} />, { theme: {}, user: { loggedIn: true } }));
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test("should load localStorage queries", async () => {
        await waitFor(() => expect(spy).toHaveBeenCalledWith(["test"]));
    });

    test("selectQuery test", async () => {
        const { getByTestId, findByTestId } = rendered;
        const trigger = getByTestId("stored-trigger");
        Simulate.click(trigger);
        const queryTrigger = await findByTestId("select-query-trigger");
        Simulate.click(queryTrigger);
        const element = await findByTestId("show-stored");
        await waitFor(() => expect(element.className.includes("listActive")).toBeFalsy());
    });

    test("selectQuery from timeline", async () => {
        const { getByTestId, findByTestId } = rendered;
        const trigger = getByTestId("stored-trigger");
        Simulate.click(trigger);
        const timeline = getByTestId("timeline");
        Simulate.change(timeline, { target: { method: "select", value: "test" } });
        const element = await findByTestId("show-stored");
        await waitFor(() => expect(element.className.includes("listActive")).toBeFalsy());
    });

    test("deleteQuery from timeline", async () => {
        jest.spyOn(utils, "concatUniqueStrings").mockImplementation(() => ["test"]);
        jest.spyOn(window.localStorage.__proto__, "setItem").mockImplementation(() => jest.fn());
        const { getByTestId } = rendered;
        const playTrigger = getByTestId("play-trigger");
        Simulate.click(playTrigger);
        const trigger = getByTestId("stored-trigger");
        Simulate.click(trigger);
        const timeline = getByTestId("timeline");
        expect(timeline[Object.keys(timeline)[1]].queries).toEqual(['test']);
        Simulate.change(timeline, { target: { method: "delete", value: "test" } });
        expect(timeline[Object.keys(timeline)[1]].queries).toEqual([]);
    });
});

describe('Comander keycodes test suite', () => {
    let rendered;
    let act;

    beforeEach(() => {
        jest.spyOn(window.localStorage.__proto__, "getItem").mockImplementation(() => ["test"]);
        JSON.parse = jest.fn().mockImplementation(() => ["", "test"]);
        ({ rendered, act } = getMockProvider(<Comander options={{}} />, { theme: {}, user: { loggedIn: true } }));
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test('keyDown test', async () => {
        const { findAllByTestId } = rendered;
        const event = new KeyboardEvent("keydown", { keyCode: 40 });
        act(() => {
            window.dispatchEvent(event);
            return undefined;
        });
        const queries = await findAllByTestId('select-query-trigger');
        expect(queries[0].className.includes('suggestionActive')).toBeTruthy();
        act(() => {
            window.dispatchEvent(event);
            return undefined;
        });
        expect(queries[1].className.includes("suggestionActive")).toBeTruthy();
        act(() => {
            window.dispatchEvent(event);
            return undefined;
        });
        expect(queries[0].className.includes("suggestionActive")).toBeTruthy();
    });

    test("keyUp test", async () => {
        const { findAllByTestId } = rendered;
        const event = new KeyboardEvent("keydown", { keyCode: 38 });
        act(() => {
            window.dispatchEvent(event);
            return undefined;
        });
        const queries = await findAllByTestId("select-query-trigger");
        expect(queries[1].className.includes("suggestionActive")).toBeTruthy();
        act(() => {
            window.dispatchEvent(event);
            return undefined;
        });
        expect(queries[0].className.includes("suggestionActive")).toBeTruthy();
    });

    test("enter test", async () => {
        const { findByTestId, getByTestId } = rendered;
        const spy = jest.spyOn(window.localStorage.__proto__, "setItem").mockImplementation(() => jest.fn());
        const trigger = getByTestId("stored-trigger");
        let event = new KeyboardEvent("keydown", { keyCode: 40 });
        act(() => {
            window.dispatchEvent(event);
            return undefined;
        });
        Simulate.click(trigger);
        event = new KeyboardEvent("keydown", { keyCode: 13 });
        act(() => {
            window.dispatchEvent(event);
            return undefined;
        });
        const element = await findByTestId("show-stored");
        await waitFor(() => expect(element.className.includes("listActive")).toBeFalsy());
        act(() => {
            window.dispatchEvent(event);
            return undefined;
        });
        expect(spy).toHaveBeenCalled();
    });

    test("default break", async () => {
        let event = new KeyboardEvent("keydown", { keyCode: 99 });
        act(() => {
            window.dispatchEvent(event);
            return undefined;
        });
        expect(true).toBeTruthy();
    })
})
