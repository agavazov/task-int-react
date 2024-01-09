import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Autocomplete from '../components/Autocomplete/Autocomplete';

describe('Autocomplete - AbortController', () => {
  test('cancels ongoing fetch request on new input', async () => {
    const abortSpy = jest.fn();
    global.AbortController = jest.fn().mockImplementation(() => {
      return { signal: {}, abort: abortSpy };
    });

    render(<Autocomplete />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'first' } });
    fireEvent.change(input, { target: { value: 'second' } });

    expect(abortSpy).toHaveBeenCalledTimes(2); // Expect abort to have been called more than once

    global.AbortController.mockRestore();
  });
});

