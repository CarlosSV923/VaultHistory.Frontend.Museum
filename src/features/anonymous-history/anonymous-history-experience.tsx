'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useState } from 'react';

type Usage = { limit: number; remaining: number; resetAt: string };
type VisitorHistory = { id: string; content: string; theme?: string; generateAt: string };
type HistoryResponse = { histories: VisitorHistory[] };

export function AnonymousHistoryExperience() {
    const [histories, setHistories] = useState<VisitorHistory[]>([]);
    const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
    const [isGenerating, setIsGenerating] = useState(false);
    const [usage, setUsage] = useState<Usage | null>(null);
    const [limitReached, setLimitReached] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function loadHistories(showLoading = true) {
        if (showLoading) setStatus('loading');
        try {
            const response = await fetch('/api/anonymous-histories', { cache: 'no-store' });
            if (!response.ok) throw new Error('No se pudieron recuperar tus historias.');
            const body = await response.json() as HistoryResponse;
            setHistories(body.histories);
            setStatus('ready');
        } catch (error) {
            setMessage(error instanceof Error ? error.message : 'No se pudieron recuperar tus historias.');
            setStatus('error');
        }
    }

    useEffect(() => {
        let active = true;
        void fetch('/api/anonymous-histories', { cache: 'no-store' })
            .then(async (response) => {
                if (!response.ok) throw new Error('No se pudieron recuperar tus historias.');
                return response.json() as Promise<HistoryResponse>;
            })
            .then((body) => { if (active) { setHistories(body.histories); setStatus('ready'); } })
            .catch((error: unknown) => { if (active) { setMessage(error instanceof Error ? error.message : 'No se pudieron recuperar tus historias.'); setStatus('error'); } });
        return () => { active = false; };
    }, []);

    async function generate(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        setIsGenerating(true);
        setMessage(null);
        const response = await fetch('/api/anonymous-histories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ theme: formData.get('theme'), character: formData.get('character') }) });
        const body = await response.json().catch(() => ({})) as { history?: string; usage?: Usage; message?: string };
        setIsGenerating(false);
        if (response.status === 429) { setUsage(body.usage ?? null); setLimitReached(true); return; }
        if (!response.ok || !body.history) { setMessage(body.message ?? 'No se pudo crear la historia.'); return; }
        setUsage(body.usage ?? null);
        event.currentTarget.reset();
        await loadHistories();
    }

    return <section className="visitor-experience" aria-labelledby="visitor-history-title">
        <div className="visitor-experience__intro"><p className="route__eyebrow">Tu mesa de escritura</p><h2 id="visitor-history-title">Crea una historia sin iniciar sesión.</h2><p>Puedes probar el archivo antes de decidir si quieres guardar tus historias en una cuenta.</p></div>
        <form className="story-form" onSubmit={generate}><label>Tema<input name="theme" maxLength={120} placeholder="Una estación de tren bajo la lluvia" /></label><label>Personaje<input name="character" maxLength={120} placeholder="Una cartógrafa" /></label><button type="submit" disabled={isGenerating}>{isGenerating ? 'Creando historia…' : 'Crear historia'}</button>{usage && <p className="usage" aria-live="polite">Te quedan {usage.remaining} de {usage.limit} consultas hoy.</p>}{message && <p className="form-message" role="alert">{message}</p>}</form>
        <div className="visitor-library"><div className="section-heading"><h2>Tus historias de visitante</h2>{status === 'ready' && <p>{histories.length === 0 ? 'Aún no has creado ninguna' : `${histories.length} disponibles`}</p>}</div>{status === 'loading' && <p className="library-state" aria-live="polite">Buscando tus historias…</p>}{status === 'error' && <div className="library-state" role="alert">No pudimos cargar tus historias.<button type="button" onClick={() => void loadHistories()}>Reintentar</button></div>}{status === 'ready' && (histories.length === 0 ? <p className="library-state">Tu primera historia aparecerá aquí.</p> : <div className="visitor-stories">{histories.map((history) => <article key={history.id}><p>{history.theme ?? 'Sin tema'}</p><span>{history.content}</span></article>)}</div>)}</div>
        {limitReached && <div className="limit-dialog" role="dialog" aria-modal="true" aria-labelledby="limit-dialog-title"><div><p className="route__eyebrow">Límite diario</p><h2 id="limit-dialog-title">Hoy ya usaste tus consultas.</h2><p>Vuelve cuando se reinicie el límite o crea una cuenta para conservar tus historias y continuar con tu biblioteca.</p><div className="limit-dialog__actions"><Link href="/register">Crear cuenta</Link><Link href="/sign-in">Iniciar sesión</Link><button type="button" onClick={() => setLimitReached(false)}>Seguir explorando</button></div></div></div>}
    </section>;
}
