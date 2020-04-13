import React from 'react';
import { render, getByTestId } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText("Login");
  expect(linkElement).toBeDefined();
});
