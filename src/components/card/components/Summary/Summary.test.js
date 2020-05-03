import React from "react";
import { getMockProvider } from "../../../../global/utils/tests/store.mock";
import { cleanup, act } from "@testing-library/react";
import { Simulate } from "react-dom/test-utils";
import Summary from "./Summary";

const summary = {
    labels: {
        node: { properties: { prop: "test" } },
    },
    relTypes: {
        relationship: { properties: { prop: "test" } },
    },
};
const item = {
    item: { labels: ["test"], properties: [ { key: 'test', value: 'test' } ] },
    type: "node",
};

describe("Summary wighout config component test suite", () => {
    let rendered;

    beforeEach(() => {
        act(() => ({ rendered } = getMockProvider(<Summary />, { user: { loggedIn: true } }, true)));
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test("component should render", () => {
        const { getByTestId } = rendered;
        const element = getByTestId("summary");
        expect(element).toBeDefined();
    });
});

describe("Summary canvas item component test suite", () => {
    let rendered;
    const _item = JSON.parse(JSON.stringify(item));
    _item.type = 'canvas';

    beforeEach(() => {
        act(() => ({ rendered } = getMockProvider(<Summary  item={_item}/>, { user: { loggedIn: true } }, true)));
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test("component should render", () => {
        const { getByTestId } = rendered;
        try {
            getByTestId("properties");
        } catch(err) {
            expect(true).toBeTruthy();
        }
    });
});

describe("Summary rel item component test suite", () => {
    let rendered;
    const _item = JSON.parse(JSON.stringify(item));
    _item.type = "rel";

    beforeEach(() => {
        act(() => ({ rendered } = getMockProvider(<Summary item={_item} />, { user: { loggedIn: true } }, true)));
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test("component should render", () => {
        const { getByTestId } = rendered;
        const element = getByTestId("properties");
        expect(element).toBeDefined();
    });
});

describe('Summary component test suite', () => {
    let rendered;

    beforeEach(() => {
        act(() =>
            ({ rendered } = getMockProvider(<Summary summary={summary} item={item}/>,
                { user: { loggedIn: true } }, true))
        )
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test('component should render', () => {
        const { getByTestId } = rendered;
        const element = getByTestId('summary');
        const props = getByTestId('properties');
        expect(element).toBeDefined();
        expect(props).toBeDefined();
    })

    test('label click test', async () => {
        const { getByTestId, findByTestId } = rendered;
        const trigger = getByTestId('label-trigger');
        Simulate.click(trigger);
        const element = await findByTestId('configurator');
        expect(element).toBeDefined();
        expect(trigger.className.includes("summaryActive")).toBeTruthy();
        Simulate.click(trigger);
        expect(trigger.className.includes('summaryActive')).toBeFalsy();
    });

    test("rel click test", async () => {
        const { getByTestId, findByTestId } = rendered;
        const trigger = getByTestId("rel-trigger");
        Simulate.click(trigger);
        const element = await findByTestId("configurator");
        expect(element).toBeDefined();
        expect(trigger.className.includes("summaryActive")).toBeTruthy();
        Simulate.click(trigger);
        expect(trigger.className.includes("summaryActive")).toBeFalsy();
    });
});
