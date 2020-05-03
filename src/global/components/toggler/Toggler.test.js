import React from 'react';
import { render } from "@testing-library/react";
import Toggler from './Toggler';
import { Simulate } from 'react-dom/test-utils';

describe('Toggler test suite', () => {
    test("toggler should render", () => {
        const { getByTestId } = render(<Toggler/>);
        const element = getByTestId("toggler");
        expect(element).toBeDefined();
    });

    test("toggler should trigger click function", () => {
        const handler = jest.fn();
        const { getByTestId } = render(<Toggler handleClick={handler}/>);
        const element = getByTestId("toggler");
        Simulate.click(element);
        expect(handler).toHaveBeenCalled();
    })
})
