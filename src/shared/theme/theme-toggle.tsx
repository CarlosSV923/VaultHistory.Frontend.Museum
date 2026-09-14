'use client';

import { useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark';

function currentTheme(): Theme {
    return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

function subscribe(onStoreChange: () => void) {
    window.addEventListener('vault-history-theme-change', onStoreChange);
    return () => window.removeEventListener('vault-history-theme-change', onStoreChange);
}

export function ThemeToggle() {
    const theme = useSyncExternalStore(subscribe, currentTheme, () => 'light');

    function toggleTheme() {
        const nextTheme: Theme = currentTheme() === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = nextTheme;
        localStorage.setItem('vault-history-theme', nextTheme);
        window.dispatchEvent(new Event('vault-history-theme-change'));
    }

    return <button className="theme-toggle" type="button" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Activar modo claro' : 'Activar modo oscuro'} aria-pressed={theme === 'dark'}>
        <span aria-hidden="true">{theme === 'dark' ? '☀' : '◐'}</span><span>{theme === 'dark' ? 'Claro' : 'Oscuro'}</span>
    </button>;
}
