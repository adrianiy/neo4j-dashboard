import React from "react";
import { getMockProvider } from "../../global/utils/tests/store.mock";
import { cleanup, waitFor, act } from "@testing-library/react";
import { Simulate } from "react-dom/test-utils";
import Card from "./Card";
import * as services from './../../service/neo.service';

global.fetch = () => ['test'];

jest.mock('../../global/components/chart/Chart', () => (props) => (
    <div
        data-testid={props["data-testid"]}
        onChange={(ev) =>
            ev.target.method === "hover"
                ? props.itemHovered(ev.target.value)
                : ev.target.method === "selected" ? props.itemSelected(ev.target.value)
                : ev.target.method === "graph" ? props.graphStyleCallback(ev.target.value)
                :props.setSummary(ev.target.value)
        }
    ></div>
));

jest.mock("./components/Summary/Summary.js", () => (props) => (
    <div
        data-testid="summary"
        selected={props.item}
        summary={props.summary}
    ></div>
));

describe('Card component test suite', () => {
    let rendered;

    beforeEach(() => {
        jest.spyOn(services, "getQuery").mockImplementation(() => "test");
        act(() =>
            ({ rendered } = getMockProvider(<Card/>,
                { user: { loggedIn: true } }))
        )
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test('Card should render', () => {
        const { getByTestId } = rendered;
        const element = getByTestId('card');
        expect(element).toBeDefined();
    });

    test('toggleExpand test', () => {
        const { getByTestId } = rendered;
        const trigger = getByTestId('toggle-expand');
        const element = getByTestId('card');
        Simulate.click(trigger);
        expect(element.className.includes('expanded')).toBeTruthy();
    });

    test('toggleFullscreen test', () => {
        const { getByTestId } = rendered;
        const trigger = getByTestId('toggle-fullscreen');
        const element = getByTestId('card');
        Simulate.click(trigger);
        expect(element.className.includes('fullscreen')).toBeTruthy();
    });

    test("toggleDownload test", () => {
        const { getByTestId } = rendered;
        const trigger = getByTestId("toggle-download");
        Simulate.click(trigger);
        const element = getByTestId("download");
        expect(element).toBeDefined();
    });
});

describe("Card component with queries test suite", () => {
    let spy;

    beforeEach(() => {
        spy = jest.spyOn(services, 'getQuery').mockImplementation(() => 'test');
        act(() =>
            getMockProvider(<Card query={'test'}/>, { user: { loggedIn: true } })
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test("getQuery should have been called", () => {
        expect(spy).toHaveBeenCalled();
    });
});

describe("Card chart test suite", () => {
    let rendered;
    let storeSpy;

    beforeEach(() => {
        jest.spyOn(services, "getQuery").mockImplementation(() => "test");
        act(() =>
            ({ rendered, storeSpy } = getMockProvider(<Card query={'test'}/>, { user: { loggedIn: true } }, true))
        )
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test("setSelected should be called", async () => {
        const { getByTestId } = rendered;
        const element = getByTestId('chart');
        const summary = getByTestId('summary')
        Simulate.change(element, { target: { method: 'selected', value: 'test' } });
        await waitFor(() => expect(summary[Object.keys(summary)[1]].selected).toEqual("test"));
    });

    test("hovered should be called", async () => {
        const { getByTestId } = rendered;
        const element = getByTestId("chart");
        const summary = getByTestId("summary");
        Simulate.change(element, { target: { method: "hover", value: { type: 'relationship' } } });
        await waitFor(() => expect(summary[Object.keys(summary)[1]].selected).toEqual({ type: "relationship" }));
    });

     test("hovered with canvas should be called", async () => {
         const { getByTestId } = rendered;
         const element = getByTestId("chart");
         const summary = getByTestId("summary");
         Simulate.change(element, { target: { method: "hover", value: { type: "canvas" } } });
         await waitFor(() => expect(summary[Object.keys(summary)[1]].selected).toEqual(null));
     });

      test("hovered not in type should be called", async () => {
          const { getByTestId } = rendered;
          const element = getByTestId("chart");
          const summary = getByTestId("summary");
          Simulate.change(element, { target: { method: "hover", value: { type: "test" } } });
          await waitFor(() => expect(summary[Object.keys(summary)[1]].selected).toEqual(null));
      });

    test("setSummary should be called", async () => {
        const { getByTestId } = rendered;
        const element = getByTestId("chart");
        const summary = getByTestId("summary");
        Simulate.change(element, { target: { method: "summary", value: "test" } });
        await waitFor(() => expect(summary[Object.keys(summary)[1]].summary).toEqual("test"));
    });

    test("graphStyleCallback should be called", async () => {
        const { getByTestId } = rendered;
        const element = getByTestId("chart");
        Simulate.change(element, { target: { method: "graph", value: { toSheet: () => '' } } });
        expect(storeSpy).toHaveBeenCalled();
    });
});

describe('Card props test suite', () => {
    let rendered;
    const restore = jest.fn();
    const deleteProp = jest.fn();

    beforeEach(() => {
        jest.spyOn(services, "getQuery").mockImplementation(() => "test");
        act(
            () =>
                ({ rendered } = getMockProvider(
                    <Card restoreQuery={restore} deleteQuery={deleteProp} />,
                    { user: { loggedIn: true } }
                ))
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test('restoreQuery test', () => {
        const { getByTestId } = rendered;
        const trigger = getByTestId('restore-trigger');
        Simulate.click(trigger);
        expect(restore).toHaveBeenCalled();
    });

    test("deleteQuery test", () => {
        const { getByTestId } = rendered;
        const trigger = getByTestId("delete-query");
        Simulate.click(trigger);
        expect(deleteProp).toHaveBeenCalled();
    });
});

describe("Card fetch error test suite", () => {
    let rendered;

    beforeEach(() => {
        jest.spyOn(services, "getQuery").mockImplementation(() => {
            throw new Error('test');
        });
        act(
            () =>
                ({ rendered } = getMockProvider(<Card query={'test'} />, {
                    user: { loggedIn: true },
                }))
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test("restoreQuery test", () => {
        const { getByTestId } = rendered;
        const error = getByTestId("error");
        expect(error.textContent).toBe('test: Error: test');
    });
});
