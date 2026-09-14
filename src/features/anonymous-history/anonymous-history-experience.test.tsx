import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { AnonymousHistoryExperience } from './anonymous-history-experience';

describe('AnonymousHistoryExperience', () => {
    afterEach(() => vi.unstubAllGlobals());

    it('shows account choices when History reports the daily limit', async () => {
        const fetchMock = vi.fn()
            .mockResolvedValueOnce(new Response(JSON.stringify({ histories: [] }), { status: 200 }))
            .mockResolvedValueOnce(new Response(JSON.stringify({ usage: { limit: 3, remaining: 0, resetAt: '2026-09-10T00:00:00.000Z' } }), { status: 429 }));
        vi.stubGlobal('fetch', fetchMock);
        render(<AnonymousHistoryExperience />);
        await screen.findByText('Tu primera historia aparecerá aquí.');

        fireEvent.change(screen.getByLabelText('Tema'), { target: { value: 'Misterio' } });
        fireEvent.submit(screen.getByRole('button', { name: 'Crear historia' }).closest('form')!);

        await waitFor(() => expect(screen.getByRole('dialog')).toBeTruthy());
        expect(screen.getByRole('link', { name: 'Crear cuenta' }).getAttribute('href')).toBe('/register');
        expect(screen.getByRole('link', { name: 'Iniciar sesión' }).getAttribute('href')).toBe('/sign-in');
    });
});
