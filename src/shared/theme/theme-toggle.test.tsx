import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeToggle } from './theme-toggle';

describe('ThemeToggle', () => {
    beforeEach(() => {
        document.documentElement.dataset.theme = 'light';
        localStorage.clear();
    });

    it('changes and persists the selected theme', () => {
        render(<ThemeToggle />);

        const control = screen.getByRole('button', { name: 'Activar modo oscuro' });
        fireEvent.click(control);

        expect(document.documentElement.dataset.theme).toBe('dark');
        expect(localStorage.getItem('vault-history-theme')).toBe('dark');
        expect(screen.getByRole('button', { name: 'Activar modo claro' }).getAttribute('aria-pressed')).toBe('true');
    });
});
