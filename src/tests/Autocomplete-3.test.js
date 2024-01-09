import React from 'react';
import { render, act } from '@testing-library/react';
import useDebounce from '../hooks/useDebounce';

function TestComponent({ callback, delay }) {
  const debouncedCallback = useDebounce(callback, delay);
  return <button onClick={() => debouncedCallback('test')}>Test</button>;
}

test('useDebounce hook delays the function call', () => {
  jest.useFakeTimers();
  const mockCallback = jest.fn();
  const delay = 500;

  const { getByText } = render(<TestComponent callback={mockCallback} delay={delay} />);
  const button = getByText('Test');

  // Simulate rapid button clicks
  act(() => {
    button.click();
    button.click();
    button.click();
  });

  // Fast-forward time
  act(() => {
    jest.advanceTimersByTime(delay);
  });

  // Expect the callback to be called only once
  expect(mockCallback).toHaveBeenCalledTimes(1);
  expect(mockCallback).toHaveBeenCalledWith('test');

  jest.useRealTimers();
});
