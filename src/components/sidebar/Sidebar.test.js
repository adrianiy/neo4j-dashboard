import React from 'react';
import { getMockProvider } from '../../global/utils/tests/store.mock';
import Sidebar from './Sidebar';

describe('Sidebar test suite', () => {
    let rendered;

    beforeEach(() => {
        ({ rendered } = getMockProvider(<Sidebar/>, {
            theme: {},
            user: { loggedIn: true },
        }));
    });

    test('Sidebar should render', () => {
        const { getByTestId } = rendered;
        const element = getByTestId('sidebar');
        expect(element).toBeDefined();
    })
})
