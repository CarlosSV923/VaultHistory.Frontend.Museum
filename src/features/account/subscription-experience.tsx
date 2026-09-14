'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/entities/user/model';
import { isSessionExpired, responseMessage } from './request';

export function SubscriptionExperience() {
    const router = useRouter(); const [profile, setProfile] = useState<UserProfile | null>(null); const [message, setMessage] = useState<string | null>(null); const [pending, setPending] = useState(false);
    useEffect(() => { void (async () => { try { const response = await fetch('/api/account', { cache: 'no-store' }); if (isSessionExpired(response)) { router.replace('/sign-in'); return; } if (!response.ok) { setMessage(await responseMessage(response, 'No pudimos cargar tus preferencias.')); return; } setProfile(await response.json() as UserProfile); } catch { setMessage('No pudimos conectar con tus preferencias.'); } })(); }, [router]);
    async function toggle() {
        if (!profile) return; setPending(true); setMessage(null);
        try { const response = await fetch('/api/account', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ notification: !profile.notification }) }); if (isSessionExpired(response)) { router.replace('/sign-in'); return; } if (!response.ok) { setMessage(await responseMessage(response, 'No pudimos guardar tu preferencia.')); return; } setProfile({ ...profile, notification: !profile.notification }); setMessage(!profile.notification ? 'Activaste las historias de cumpleaños.' : 'Pausaste las historias de cumpleaños.'); } catch { setMessage('No pudimos guardar tu preferencia.'); } finally { setPending(false); }
    }
    if (!profile) return <section className="account-page"><p className="library-state" role={message ? 'alert' : undefined}>{message ?? 'Cargando tus preferencias…'}</p></section>;
    return <section className="account-page"><div className="page-heading"><p className="route__eyebrow">Preferencias</p><h1>Suscripción</h1><p>Elige si quieres recibir una historia en tu cumpleaños.</p></div><section className="subscription-card"><p className="subscription-card__state" data-enabled={profile.notification}>{profile.notification ? 'Activa' : 'Pausada'}</p><h2>Historia de cumpleaños</h2><p>{profile.notification ? 'Recibirás una historia según las preferencias de tu perfil.' : 'No enviaremos historias de cumpleaños hasta que vuelvas a activar esta preferencia.'}</p><button type="button" onClick={() => void toggle()} disabled={pending}>{pending ? 'Guardando…' : profile.notification ? 'Pausar notificaciones' : 'Activar notificaciones'}</button>{message && <p className="form-message" role="status">{message}</p>}</section><p className="account-page__link"><Link href="/profile">Editar perfil y preferencias de historia</Link></p></section>;
}
