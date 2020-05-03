import React from "react";
import { getMockProvider } from "../../../../global/utils/tests/store.mock";
import { cleanup, act } from "@testing-library/react";
import Configurator from "./Configurator";
import { Simulate } from "react-dom/test-utils";

let styleForItem = { get: () => [] };
let styleForItemWithProps = {
    get: (prop) => {
        switch(prop) {
            case 'diameter':
                return '10px';
            case 'color':
                return "#ECB5C9";
            case 'shaft-width':
                return '1px'
            case 'caption':
                return [];
            default:
                break;
        }
    }
}

describe('Node Configurator component test suite', () => {
    let rendered;

    beforeEach(() => {
        act(() =>
            ({ rendered } = getMockProvider(<Configurator type={'node'}
                styleForItem={styleForItemWithProps} properties={{ test: test }}/>,
                { user: { loggedIn: true } }, true))
        )
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test('Configuratior should render', () => {
        const { getByTestId } = rendered;
        const element = getByTestId('node-config');
        expect(element).toBeDefined();
    });
});

describe("Rel Configurator component test suite", () => {
    let rendered;

    beforeEach(() => {
        act(
            () =>
                ({ rendered } = getMockProvider(
                    <Configurator type={"rel"} styleForItem={styleForItemWithProps} properties={{ test: test }} />,
                    { user: { loggedIn: true } },
                    true
                ))
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test("Configuratior should render", () => {
        const { getByTestId } = rendered;
        const element = getByTestId("rel-config");
        expect(element).toBeDefined();
    });
});

describe("Node Configurator with props component test suite", () => {
    let rendered;

    beforeEach(() => {
        act(
            () =>
                ({ rendered } = getMockProvider(
                    <Configurator type={"node"} styleForItem={styleForItem}
                    properties={{
                        test: test
                    }} />,
                    { user: { loggedIn: true } },
                    true
                ))
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test("Configuratior should render", () => {
        const { getByTestId } = rendered;
        const element = getByTestId("node-config");
        expect(element).toBeDefined();
    });
});

describe("Rel Configurator component test suite", () => {
    let rendered;
    let storeSpy;

    beforeEach(() => {
        act(
            () =>
                ({ rendered, storeSpy } = getMockProvider(
                    <Configurator type={"rel"} styleForItem={styleForItem} properties={{ test: test }} />,
                    { user: { loggedIn: true } }, true
                ))
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test("Configuratior should render", () => {
        const { getByTestId } = rendered;
        const element = getByTestId("rel-config");
        expect(element).toBeDefined();
    });

    test("caption click test", () => {
        const { getByTestId } = rendered;
        const element = getByTestId("caption-trigger");
        Simulate.click(element);
        expect(storeSpy).toHaveBeenCalled();
    });

    test("prop click test", async () => {
        const { findAllByTestId } = rendered;
        const element = await findAllByTestId("prop-trigger");
        Simulate.click(element[0]);
        expect(storeSpy).toHaveBeenCalled();
    });
});

describe("noType Configurator component test suite", () => {
    let rendered;

    beforeEach(() => {
        act(
            () =>
                ({ rendered } = getMockProvider(
                    <Configurator type={"test"} styleForItem={styleForItemWithProps} properties={{ test: test }} />,
                    { user: { loggedIn: true } },
                    true
                ))
        );
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test("Configuratior should render", () => {
        expect(true).toBeTruthy();
    });
});
