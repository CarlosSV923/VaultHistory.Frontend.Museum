'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { History, HistoryPage } from '@/entities/history/model';
import { isSessionExpired, responseMessage } from '@/features/account/request';

type Filters = { theme: string; character: string; type: string };
const initialFilters: Filters = { theme: '', character: '', type: '' };

export function LibraryExperience() {
    const router = useRouter(); const [page, setPage] = useState<HistoryPage | null>(null); const [filters, setFilters] = useState(initialFilters); const [message, setMessage] = useState<string | null>(null); const [loading, setLoading] = useState(true); const [creating, setCreating] = useState(false);
    const load = useCallback(async (targetPage: number, nextFilters: Filters) => {
        const query = new URLSearchParams({ page: String(targetPage), pageSize: '12' });
        Object.entries(nextFilters).forEach(([key, value]) => { if (value) query.set(key, value); });
        try { const response = await fetch(`/api/histories?${query}`, { cache: 'no-store' }); if (isSessionExpired(response)) { router.replace('/sign-in'); return; } if (!response.ok) { setMessage(await responseMessage(response, 'No pudimos cargar tu biblioteca.')); return; } setMessage(null); setPage(await response.json() as HistoryPage); } catch { setMessage('No pudimos conectar con tu biblioteca.'); } finally { setLoading(false); }
    }, [router]);
    useEffect(() => {
        let active = true;
        void fetch('/api/histories?page=1&pageSize=12', { cache: 'no-store' })
            .then(async (response) => {
                if (isSessionExpired(response)) { router.replace('/sign-in'); return; }
                if (!response.ok) { if (active) setMessage(await responseMessage(response, 'No pudimos cargar tu biblioteca.')); return; }
                const historyPage = await response.json() as HistoryPage;
                if (active) { setMessage(null); setPage(historyPage); }
            })
            .catch(() => { if (active) setMessage('No pudimos conectar con tu biblioteca.'); })
            .finally(() => { if (active) setLoading(false); });
        return () => { active = false; };
    }, [router]);
    async function applyFilters(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const values = new FormData(event.currentTarget); const next = { theme: String(values.get('theme') ?? '').trim(), character: String(values.get('character') ?? '').trim(), type: String(values.get('type') ?? '') }; setFilters(next); setLoading(true); setMessage(null); await load(1, next); }
    async function create(event: FormEvent<HTMLFormElement>) { event.preventDefault(); const values = new FormData(event.currentTarget); const payload = { ...(values.get('date') ? { date: values.get('date') } : {}), ...(values.get('theme') ? { theme: String(values.get('theme')) } : {}), ...(values.get('character') ? { character: String(values.get('character')) } : {}) }; if (Object.keys(payload).length === 0) { setMessage('Indica al menos una idea para tu historia.'); return; } setCreating(true); setMessage(null); try { const response = await fetch('/api/histories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }); if (isSessionExpired(response)) { router.replace('/sign-in'); return; } if (!response.ok) { setMessage(await responseMessage(response, 'No pudimos crear tu historia.')); return; } event.currentTarget.reset(); setLoading(true); await load(1, filters); } catch { setMessage('No pudimos crear tu historia.'); } finally { setCreating(false); } }
    async function deactivate(history: History) { if (!window.confirm('¿Quieres retirar esta historia de tu biblioteca?')) return; setMessage(null); try { const response = await fetch(`/api/histories/${encodeURIComponent(history.id)}`, { method: 'PATCH' }); if (isSessionExpired(response)) { router.replace('/sign-in'); return; } if (!response.ok) { setMessage(await responseMessage(response, 'No pudimos retirar la historia.')); return; } setLoading(true); await load(page?.meta.page ?? 1, filters); } catch { setMessage('No pudimos retirar la historia.'); } }
    return <section className="library-page"><div className="page-heading"><p className="route__eyebrow">Tu colección</p><h1>Biblioteca</h1><p>Cada historia que aparece aquí pertenece a tu sesión.</p></div><form id="create-story" className="story-form story-form--wide" onSubmit={create}><h2>Crear una historia</h2><label>Fecha o época <input name="date" maxLength={50} placeholder="Una noche de otoño" /></label><label>Tema <input name="theme" maxLength={120} placeholder="Un misterio junto al mar" /></label><label>Personaje <input name="character" maxLength={120} placeholder="Una restauradora" /></label><button type="submit" disabled={creating}>{creating ? 'Creando…' : 'Crear historia'}</button></form><form className="library-filters" onSubmit={applyFilters}><label>Tema <input name="theme" defaultValue={filters.theme} /></label><label>Personaje <input name="character" defaultValue={filters.character} /></label><label>Tipo <select name="type" defaultValue={filters.type}><option value="">Todos</option><option value="query">Creadas por ti</option><option value="subscription">Suscripción</option></select></label><button type="submit">Aplicar filtros</button></form>{message && <p className="form-message" role="alert">{message}</p>}{loading && <p className="library-state">Abriendo tu biblioteca…</p>}{!loading && page?.histories.length === 0 && <p className="library-state">Aún no hay historias con estos filtros. <Link href="#create-story">Crea la primera.</Link></p>}{!loading && page && page.histories.length > 0 && <><div className="personal-stories">{page.histories.map((history) => <article key={history.id}><p>{history.theme ?? history.type}</p><h2>{history.character ?? 'Historia personal'}</h2><span>{history.content}</span><footer><time dateTime={history.generateAt}>{new Date(history.generateAt).toLocaleDateString('es-EC')}</time><button type="button" onClick={() => void deactivate(history)}>Retirar</button></footer></article>)}</div><nav className="pagination" aria-label="Paginación de biblioteca"><button type="button" disabled={page.meta.page === 1} onClick={() => { setLoading(true); void load(page.meta.page - 1, filters); }}>Anterior</button><span>Página {page.meta.page} de {page.meta.totalPages || 1}</span><button type="button" disabled={page.meta.page >= page.meta.totalPages} onClick={() => { setLoading(true); void load(page.meta.page + 1, filters); }}>Siguiente</button></nav></>}</section>;
}
