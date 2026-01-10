import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ClienteForm from '../ClienteForm';

test('hello world!', () => {
    render(<ClienteForm />);
    const input = screen.getByLabelText(/nombre/i);
    fireEvent.change(input, { target: { value: 'Juan' } });
    expect(input.value).toBe('Juan');
});