import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { setup } from './global/utils/tests/store.mock';

describe('App test suite', () => {
    beforeAll(() => {

    })

    test('renders login button if user is not logged in', () => {
        const { MockProvider } = setup({ theme: {}, user: { loggedIn: false } });
        const { getByText } = render(<MockProvider><App /></MockProvider>);
        const linkElement = getByText("Login");
        expect(linkElement).toBeDefined();
    });
})

