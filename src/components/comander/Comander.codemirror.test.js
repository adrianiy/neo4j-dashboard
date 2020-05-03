import React, * as react from "react";
import { getMockProvider } from "../../global/utils/tests/store.mock";
import { Simulate } from "react-dom/test-utils";
import Comander from "./Comander";
import { waitFor, cleanup } from "@testing-library/react";

jest.mock("./CypherCodeMirror.js", () => {
    const React = require("react");
    return React.forwardRef((props, ref) => (
        <div data-testid={props["data-testid"]} ref={ref} onChange={(ev) => props.onChange(ev.target.value)}></div>
    ));
});

describe("Codemirror tests suite", () => {
    let rendered;
    let fn = jest.fn();

    beforeEach(() => {
        jest.spyOn(react, 'useState').mockImplementation(() => ['', fn]);
        ({ rendered } = getMockProvider(<Comander options={{}} />, { theme: {}, user: { loggedIn: true } }));
    });

     afterEach(() => {
         jest.restoreAllMocks();
         cleanup();
     });

    test("setQuery test", async () => {
        const { getByTestId } = rendered;
        const codemirror = getByTestId("codemirror");
        Simulate.change(codemirror, { target: { value: 'test' } });
        await waitFor(() => expect(fn).toHaveBeenCalledWith('test'));
    });
});
