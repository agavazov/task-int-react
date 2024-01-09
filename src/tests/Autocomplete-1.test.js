import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Autocomplete from '../components/Autocomplete/Autocomplete';

describe('Autocomplete - Basic Rendering', () => {
  test('renders input element', () => {
    render(<Autocomplete />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('renders input element and responds to input changes', () => {
    render(<Autocomplete />);

    const input = screen.getByRole('textbox');
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'test' } });
    expect(input.value).toBe('test');
  });

  test('shows "Loading..." message when fetching data', async () => {
    // Mock the fetch function to delay the response
    global.fetch = jest.fn(() =>
      new Promise(resolve => setTimeout(() => resolve({ json: () => Promise.resolve([]) }), 1000)),
    );

    render(<Autocomplete />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    // Check if "Loading..." is displayed
    await waitFor(() => {
      expect(screen.getByText('Loading...')).toBeInTheDocument();
    });

    // Restore original fetch function if needed
    global.fetch.mockRestore();
  });

  test('displays "No results found" for a non-matching query', async () => {
    // Mock the fetch function to return an empty array
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve([]) // No results
      })
    );

    render(<Autocomplete />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'asdfghjklasdfg' } });

    // Wait for and check if "No results found" is displayed
    await waitFor(() => {
      expect(screen.getByText('No results found')).toBeInTheDocument();
    });

    // Restore original fetch function if needed
    global.fetch.mockRestore();
  });

  test('displays "An error occurred" message on fetch failure', async () => {
    // Mock the fetch function to simulate a network error
    global.fetch = jest.fn(() =>
      Promise.reject(new Error('Network error'))
    );

    render(<Autocomplete />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'error test' } });

    // Wait for and check if "An error occurred" is displayed
    await waitFor(() => {
      expect(screen.getByText('An error occurred')).toBeInTheDocument();
    });

    // Restore original fetch function if needed
    global.fetch.mockRestore();
  });

  test('initially does not show loading or error messages', () => {
    render(<Autocomplete />);

    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText('No results found')).not.toBeInTheDocument();
    expect(screen.queryByText('An error occurred')).not.toBeInTheDocument();
  });
});
