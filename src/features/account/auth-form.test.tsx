import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AuthForm } from './auth-form';

const replace = vi.fn();
const refresh = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: () => ({ replace, refresh }) }));

describe('AuthForm', () => {
    afterEach(() => { vi.unstubAllGlobals(); vi.clearAllMocks(); });

    it('sends registration details to the BFF instead of storing a token in browser storage', async () => {
        const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ expiresAt: '2026-10-01T00:00:00.000Z' }), { status: 200 }));
        vi.stubGlobal('fetch', fetchMock);
        render(<AuthForm mode="register" />);
        fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Ada' } });
        fireEvent.change(screen.getByLabelText('Apellido'), { target: { value: 'Lovelace' } });
        fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'ada@example.com' } });
        fireEvent.change(screen.getByLabelText('Contraseña'), { target: { value: 'a-secure-password' } });
        fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }));

        await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
        expect(fetchMock.mock.calls[0][0]).toBe('/api/auth/register');
        expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com' });
        expect(localStorage.getItem('vault_history_session')).toBeNull();
        expect(replace).toHaveBeenCalledWith('/library');
    });
});
