import React from 'react';
import { render, screen } from '@testing-library/react';
import ClienteList from '../ClienteList';

test('renders client list correctly', () => {
    const clients = [{ id: 1, name: 'Client A' }, { id: 2, name: 'Client B' }];
    render(<ClienteList clients={clients} />);
    expect(screen.getByText('Client A')).toBeInTheDocument();
    expect(screen.getByText('Client B')).toBeInTheDocument();
});