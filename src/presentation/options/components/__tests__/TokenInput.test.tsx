import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TokenInput } from '../TokenInput';
import { LanguageContext } from '@/presentation/i18n/useLanguage';
import { translations } from '@/presentation/i18n/translations';

function renderWithLanguage(ui: React.ReactElement) {
  return render(
    <LanguageContext.Provider
      value={{
        language: 'en',
        t: translations.en,
        setLanguage: async () => {},
      }}
    >
      {ui}
    </LanguageContext.Provider>
  );
}

describe('TokenInput', () => {
  it('should render token input', () => {
    renderWithLanguage(<TokenInput value="" onChange={vi.fn()} />);

    expect(screen.getByPlaceholderText(/ghp_/i)).toBeInTheDocument();
  });

  it('should call onChange when input changes', () => {
    const onChange = vi.fn();
    renderWithLanguage(<TokenInput value="" onChange={onChange} />);

    const input = screen.getByPlaceholderText(/ghp_/i);
    fireEvent.change(input, { target: { value: 'test-token' } });

    expect(onChange).toHaveBeenCalledWith('test-token');
  });

  it('should display error message', () => {
    renderWithLanguage(<TokenInput value="" onChange={vi.fn()} error="Invalid token" />);

    expect(screen.getByText('Invalid token')).toBeInTheDocument();
  });

  it('should toggle password visibility', () => {
    renderWithLanguage(<TokenInput value="test-token" onChange={vi.fn()} />);

    const input = screen.getByPlaceholderText(/ghp_/i) as HTMLInputElement;
    const toggleButton = screen.getByLabelText(/Show token/i);

    expect(input.type).toBe('password');

    fireEvent.click(toggleButton);

    expect(input.type).toBe('text');
  });
});


