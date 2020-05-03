import React, * as react from "react";
import { getMockProvider } from "../../global/utils/tests/store.mock";
import { Simulate } from "react-dom/test-utils";
import { cleanup, waitFor } from "@testing-library/react";
import Login, { getSuggestions, getSuggestionValue, renderSuggestion } from "./Login";
import * as services from "../../service/neo.service";

jest.mock("@adrianiy/react-autosuggest", () => {
    return function MockComander() {
        return <div></div>;
    };
});

describe('Login test suite', () => {
    let rendered;
    const callback = jest.fn();

    beforeEach(() => {
         ({ rendered } = getMockProvider(<Login callback={callback}/>, {
             theme: {},
             user: { loggedIn: true },
         }));
    });

    afterEach(() => {
        cleanup();
        jest.restoreAllMocks();
    })

    describe('render test', () => {
        test('login should render', () => {
            const { getByTestId } = rendered;
            const element = getByTestId('login');
            expect(element).toBeDefined();
        })
    });

    describe("login test suite", () => {
        let form;
        beforeEach(() => {
            const { getByTestId } = rendered;
            const user = getByTestId("user");
            const pass = getByTestId("password");
            form = getByTestId("form");
            Simulate.change(user, { target: { value: "user" } });
            Simulate.change(pass, { target: { value: "pass" } });
        });

        test("should do login on form submit", async () => {
            jest.spyOn(services, 'doLogin').mockImplementation(() => ({ id: 'test' }));
            Simulate.submit(form);
            await waitFor(() => expect(callback).toHaveBeenCalledWith({ sessionId: "test", user: "user" }));
        });

        test('should render error', async () => {
            const { findByTestId } = rendered;
            jest.spyOn(services, 'doLogin').mockImplementation(() => null);
            Simulate.submit(form);
            const error = await findByTestId('error');
            expect(error).toBeDefined();
        });

        test('network connection error', async () => {
            const { findByTestId } = rendered;
            jest.spyOn(services, "doLogin").mockImplementation(() => {
                throw new Error('test');
            });
            Simulate.submit(form);
            const error = await findByTestId("error");
            expect(error).toBeDefined();
        })
    });

    describe('saved history cookies test suite', () => {
        test('should setHistory when cookies are setted', () => {
            const fn = jest.fn();
            jest.spyOn(react, 'useState').mockImplementation(() => [[], fn]);
            cleanup();
            jest.spyOn(window.localStorage.__proto__, "getItem").mockImplementation(() =>
                JSON.stringify({ test: "test" })
            );

            ({ rendered } = getMockProvider(<Login />, {
                theme: {},
                user: { loggedIn: true },
            }));

            expect(fn).toHaveBeenCalledWith({ test: 'test' });
        })
    });
})

describe('auxiliar methods test suite', () => {
    const suggestions = [{ uri: 'test' }];
    test('getSuggestions test', () => {
        const result = getSuggestions('test', suggestions);
        expect(result).toEqual([{ uri: 'test' }])
    });

    test('getSuggestion no length test', () => {
        const result = getSuggestions(' ', suggestions);
        expect(result).toEqual([]);
    });

    test('getSuggestion no value test', () => {
        const result = getSuggestions(null, suggestions);
        expect(result).toEqual([]);
    })

    test('getSuggestionValue test', () => {
        const result = getSuggestionValue(suggestions[0]);
        expect(result).toBe('test');
    })

    test('renderSuggestions test', () => {
        const result = renderSuggestion(suggestions[0]);
        expect(result.type).toBe('span');
    })
})
