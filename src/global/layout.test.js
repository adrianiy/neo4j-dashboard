import React from 'react';
import { render } from "@testing-library/react";
import { Simulate } from "react-dom/test-utils";
import { RowLayout, ColumnLayout } from "./layouts";

describe('layout test suite', () => {
    test('row layout test', () => {
        const { getByTestId } = render(<RowLayout data-testid="test"/>);
        const element = getByTestId('test');
        expect(element).toBeDefined();
    });

    test("row layout click test", () => {
        const handler = jest.fn();
        const { getByTestId } = render(<RowLayout data-testid="test" onClick={handler} />);
        const element = getByTestId("test");
        Simulate.click(element)
        expect(handler).toHaveBeenCalled();
    });

    test("col layout test", () => {
        const { getByTestId } = render(<ColumnLayout data-testid="test" />);
        const element = getByTestId("test");
        expect(element).toBeDefined();
    });

     test("col layout click test", () => {
         const handler = jest.fn();
         const { getByTestId } = render(<ColumnLayout data-testid="test" onClick={handler} />);
         const element = getByTestId("test");
         Simulate.click(element);
         expect(handler).toHaveBeenCalled();
     });
})
