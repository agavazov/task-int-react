import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import Autocomplete from '../components/Autocomplete/Autocomplete';

jest.mock('axios');

describe('Autocomplete - Displaying Results', () => {
  test('shows results when fetched from the API', async () => {
    const mockResponse = { data: { items: [{ full_name: 'facebook/react' }, { full_name: 'vuejs/vue' }] } };
    axios.get.mockResolvedValueOnce(mockResponse);

    render(<Autocomplete />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'js' } });

    await waitFor(() => expect(screen.getByText('facebook/react')).toBeInTheDocument());
    expect(screen.getByText('vuejs/vue')).toBeInTheDocument();
  });

  test('shows no results message when API returns empty array', async () => {
    axios.get.mockResolvedValueOnce({ data: { items: [] } });

    render(<Autocomplete />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'unknownquery' } });

    await waitFor(() => expect(screen.getByText('No results found')).toBeInTheDocument());
  });
});
