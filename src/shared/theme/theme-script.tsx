const themeScript = `(() => { try { const stored = localStorage.getItem('vault-history-theme'); const theme = stored === 'dark' || stored === 'light' ? stored : window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'; document.documentElement.dataset.theme = theme; } catch { document.documentElement.dataset.theme = 'light'; } })();`;

export function ThemeScript() { return <script dangerouslySetInnerHTML={{ __html: themeScript }} />; }
