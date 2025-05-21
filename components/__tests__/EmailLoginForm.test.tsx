import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { EmailLoginForm } from '../EmailLoginForm';
import { Toaster } from '../ui/toaster';

// Mock the useToast hook
const mockToast = jest.fn();
jest.mock('../ui/use-toast', () => ({
  useToast: () => ({
    toast: mockToast,
  }),
}));

describe('EmailLoginForm', () => {
  const mockOnLogin = jest.fn();

  beforeEach(() => {
    mockOnLogin.mockClear();
    mockToast.mockClear();
  });

  it('renders email and password inputs', () => {
    render(<EmailLoginForm onLogin={mockOnLogin} />);
    
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('validates email format', async () => {
    render(<>
      <EmailLoginForm onLogin={mockOnLogin} />
      <Toaster />
    </>);
    
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    // Invalid email
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Invalid Email',
        })
      );
      expect(mockOnLogin).not.toHaveBeenCalled();
    });
  });

  it('validates password length', async () => {
    render(<>
      <EmailLoginForm onLogin={mockOnLogin} />
      <Toaster />
    </>);
    
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    // Invalid password
    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
    fireEvent.change(passwordInput, { target: { value: '123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Invalid Password',
        })
      );
      expect(mockOnLogin).not.toHaveBeenCalled();
    });
  });

  it('calls onLogin with correct credentials', async () => {
    mockOnLogin.mockResolvedValue(undefined);

    render(<EmailLoginForm onLogin={mockOnLogin} />);
    
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockOnLogin).toHaveBeenCalledWith('valid@email.com', 'password123');
    });
  });

  it('handles login error', async () => {
    const errorMessage = 'Login failed';
    mockOnLogin.mockRejectedValue(new Error(errorMessage));

    render(<>
      <EmailLoginForm onLogin={mockOnLogin} />
      <Toaster />
    </>);
    
    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    fireEvent.change(emailInput, { target: { value: 'valid@email.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Login Failed',
        })
      );
    });
  });
});