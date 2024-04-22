import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { navigate } from 'gatsby';

import LoginPage from '../pages/login';
import { AuthContext } from '../components/AuthProvider';

const authContextValue = {
    login: jest.fn()
};

jest.mock('gatsby', () => ({
    navigate: jest.fn()
}));

describe('Login Page', () => {
    it('renders login form correctly', () => {
        render(<LoginPage />);
        expect(screen.getAllByText('Login')).toHaveLength(2);
        expect(screen.getByLabelText('Username:')).toBeInTheDocument();
        expect(screen.getByLabelText('Password:')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
    });


    it('displays error message for invalid credentials', async () => {
        render(<LoginPage />);

        fireEvent.change(screen.getByLabelText('Username:'), { target: { value: 'invalid' } });
        fireEvent.change(screen.getByLabelText('Password:'), { target: { value: 'invalid' } });

        fireEvent.click(screen.getByRole('button', { name: 'Login' }));

        await waitFor(() => {
            expect(screen.getByText('Invalid username or password')).toBeInTheDocument();
            expect(navigate).not.toHaveBeenCalled();
        });
    });
});
