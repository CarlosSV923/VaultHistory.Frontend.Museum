'use client';

export function RouteError({ reset }: Readonly<{ reset: () => void }>) { return <main className="state"><h1>No se pudo cargar esta sección</h1><p>Inténtalo de nuevo. Si el problema continúa, vuelve más tarde.</p><button type="button" onClick={reset}>Reintentar</button></main>; }
