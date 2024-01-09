import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import Autocomplete from '../components/Autocomplete/Autocomplete';

jest.mock('axios');

describe('Autocomplete - Network Interaction', () => {
  test('displays loading state during data fetching', async () => {
    const mockResponse = { data: { items: [] } };
    axios.get.mockResolvedValueOnce(mockResponse);

    render(<Autocomplete />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'react' } });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
    await waitFor(() => expect(axios.get).toHaveBeenCalled());
  });

  // Additional tests for network success and failure cases
});
