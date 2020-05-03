import React, * as react from 'react';
import { getMockProvider } from "../../global/utils/tests/store.mock";
import { cleanup } from "@testing-library/react";
import Timeline from './Timeline';

jest.mock('./../card/Card.js', () => {
     return function MockComander() {
         return <div></div>;
     };
})

describe('Timeline teset suite', () => {
    let rendered;

    beforeEach(() => {
        ({ rendered } = getMockProvider(<Timeline queries={["test"]} />, {
            theme: {},
            user: { loggedIn: true },
        }));
    });

    afterEach(() => {
        cleanup();
        jest.restoreAllMocks();
    });

    describe('render test suite', () => {
        test('should render timeline', () => {
            const { getByTestId } = rendered;
            const element = getByTestId('timeline');
            expect(element).toBeDefined();
        });
    });

    describe('Timeline methods test suite', () => {
        test('should set queries', () => {
            cleanup();
            const fn = jest.fn();
            jest.spyOn(react, "useState").mockImplementation(() => [[], fn]);
            ({ rendered } = getMockProvider(<Timeline queries={['test']}/>, {
                theme: {},
                user: { loggedIn: true },
            }));
            expect(fn).toHaveBeenCalledWith(['test']);
        })
    });
})
