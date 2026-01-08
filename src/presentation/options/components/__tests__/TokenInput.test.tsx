import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TokenInput } from '../TokenInput';

describe('TokenInput', () => {
  it('should render token input', () => {
    render(<TokenInput value="" onChange={vi.fn()} />);

    expect(screen.getByLabelText(/GitHub Personal Access Token/i)).toBeInTheDocument();
  });

  it('should call onChange when input changes', () => {
    const onChange = vi.fn();
    render(<TokenInput value="" onChange={onChange} />);

    const input = screen.getByLabelText(/GitHub Personal Access Token/i);
    fireEvent.change(input, { target: { value: 'test-token' } });

    expect(onChange).toHaveBeenCalledWith('test-token');
  });

  it('should display error message', () => {
    render(<TokenInput value="" onChange={vi.fn()} error="Invalid token" />);

    expect(screen.getByText('Invalid token')).toBeInTheDocument();
  });

  it('should toggle password visibility', () => {
    render(<TokenInput value="test-token" onChange={vi.fn()} />);

    const input = screen.getByLabelText(/GitHub Personal Access Token/i) as HTMLInputElement;
    const toggleButton = screen.getByLabelText(/Show token/i);

    expect(input.type).toBe('password');

    fireEvent.click(toggleButton);

    expect(input.type).toBe('text');
  });
});

