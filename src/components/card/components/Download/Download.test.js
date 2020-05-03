import React from "react";
import { getMockProvider } from "../../../../global/utils/tests/store.mock";
import { cleanup, act } from "@testing-library/react";
import Download from "./Download";
import { Simulate } from "react-dom/test-utils";
import * as imgUtils from "./utils/exporting/imageUtils";
const fileSaver = require('file-saver');

describe('Download component test suite', () => {
    let rendered;
    const results = {
        records: [
            { keys: [ 'test' ], _fields: ['test'], get: () => 'test' }
        ]
    };
    let spy;
    let pngSpy;
    let svgSpy

    beforeEach(() => {
        spy = jest.spyOn(fileSaver, "saveAs").mockImplementation(() => jest.fn());
        pngSpy = jest.spyOn(imgUtils, 'downloadPNGFromSVG').mockImplementation(() => jest.fn());
        svgSpy = jest.spyOn(imgUtils, "downloadSVG").mockImplementation(() => jest.fn());
        act(() =>
            ({ rendered } = getMockProvider(<Download results={results} vis={{}}/>,
                { user: { loggedIn: true } }))
        )
    });

    afterEach(() => {
        jest.restoreAllMocks();
        cleanup();
    });

    test('Download should render', () => {
        const { getByTestId } = rendered;
        const element = getByTestId('download');
        expect(element).toBeDefined();
    });

    test('DownloadCSV test', () => {
        const { getByTestId } = rendered;
        const trigger = getByTestId('csv-trigger');
        Simulate.click(trigger);
        expect(spy).toHaveBeenCalledWith(new Blob(), 'export.csv');
    });

    test('DownloadJSON test', () => {
        const { getByTestId } = rendered;
        const trigger = getByTestId("json-trigger");
        Simulate.click(trigger);
        expect(spy).toHaveBeenCalledWith(new Blob(), 'records.json');
    })

    test("exportPNG test", () => {
        const { getByTestId } = rendered;
        const trigger = getByTestId("png-trigger");
        Simulate.click(trigger);
        expect(pngSpy).toHaveBeenCalled();
    });

    test("exportSVG test", () => {
        const { getByTestId } = rendered;
        const trigger = getByTestId("svg-trigger");
        Simulate.click(trigger);
        expect(svgSpy).toHaveBeenCalled();
    })
});
