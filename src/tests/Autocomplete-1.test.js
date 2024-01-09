import React from 'react';
import { render, screen } from '@testing-library/react';
import Autocomplete from '../components/Autocomplete/Autocomplete';

describe('Autocomplete - Basic Rendering', () => {
  test('renders input element', () => {
    render(<Autocomplete />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  test('initially does not show loading or error messages', () => {
    render(<Autocomplete />);
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText('An error occurred')).not.toBeInTheDocument();
    expect(screen.queryByText('No results found')).not.toBeInTheDocument();
  });
});
