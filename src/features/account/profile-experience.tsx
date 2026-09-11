'use client';

import Link from 'next/link';
import { FormEvent, useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { UserProfile } from '@/entities/user/model';
import { isSessionExpired, responseMessage } from './request';

export function ProfileExperience() {
    const router = useRouter();
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const [passwordPending, setPasswordPending] = useState(false);

    const load = useCallback(async () => {
        try {
            const response = await fetch('/api/account', { cache: 'no-store' });
            if (isSessionExpired(response)) { router.replace('/sign-in'); return; }
            if (!response.ok) { setMessage(await responseMessage(response, 'No pudimos cargar tu perfil.')); return; }
            setMessage(null); setProfile(await response.json() as UserProfile);
        } catch { setMessage('No pudimos conectar con tu perfil.'); }
    }, [router]);
    useEffect(() => {
        let active = true;
        void fetch('/api/account', { cache: 'no-store' })
            .then(async (response) => {
                if (isSessionExpired(response)) { router.replace('/sign-in'); return; }
                if (!response.ok) { if (active) setMessage(await responseMessage(response, 'No pudimos cargar tu perfil.')); return; }
                const user = await response.json() as UserProfile;
                if (active) { setMessage(null); setProfile(user); }
            })
            .catch(() => { if (active) setMessage('No pudimos conectar con tu perfil.'); });
        return () => { active = false; };
    }, [router]);
    async function save(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        const body = {
            firstName: String(values.get('firstName') ?? '').trim() || undefined,
            lastName: String(values.get('lastName') ?? '').trim() || undefined,
            ...(values.get('birthDate') ? { birthDate: values.get('birthDate') } : {}),
            notification: values.get('notification') === 'on',
            theme: String(values.get('theme') ?? '').trim() || undefined,
            character: String(values.get('character') ?? '').trim() || undefined,
        };
        setPending(true); setMessage(null);
        try {
            const response = await fetch('/api/account', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
            if (isSessionExpired(response)) { router.replace('/sign-in'); return; }
            if (!response.ok) { setMessage(await responseMessage(response, 'No pudimos guardar tus cambios.')); return; }
            setMessage('Tus preferencias se guardaron.'); await load();
        } catch { setMessage('No pudimos guardar tus cambios. Inténtalo de nuevo.'); }
        finally { setPending(false); }
    }
    async function changePassword(event: FormEvent<HTMLFormElement>) {
        event.preventDefault(); const values = new FormData(event.currentTarget);
        const currentPassword = String(values.get('currentPassword') ?? ''); const newPassword = String(values.get('newPassword') ?? '');
        if (!currentPassword || newPassword.length < 8) { setMessage('Indica tu contraseña actual y una nueva de al menos 8 caracteres.'); return; }
        setPasswordPending(true); setMessage(null);
        try {
            const response = await fetch('/api/account/password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ currentPassword, newPassword }) });
            if (isSessionExpired(response)) { router.replace('/sign-in'); return; }
            if (!response.ok) { setMessage(await responseMessage(response, 'No pudimos cambiar la contraseña.')); return; }
            event.currentTarget.reset(); setMessage('Tu contraseña se actualizó.');
        } catch { setMessage('No pudimos cambiar la contraseña.'); }
        finally { setPasswordPending(false); }
    }
    async function deactivate() {
        if (!window.confirm('¿Quieres desactivar tu cuenta? Esta acción cerrará tu sesión.')) return;
        setPending(true); setMessage(null);
        try {
            const response = await fetch('/api/account', { method: 'DELETE' });
            if (!response.ok) { setMessage(await responseMessage(response, 'No pudimos desactivar tu cuenta.')); return; }
            router.replace('/explore'); router.refresh();
        } catch { setMessage('No pudimos desactivar tu cuenta.'); }
        finally { setPending(false); }
    }
    if (!profile) return <section className="account-page"><p className="library-state" role={message ? 'alert' : undefined}>{message ?? 'Cargando tu perfil…'}</p>{message && <button className="text-button" onClick={() => void load()}>Reintentar</button>}</section>;
    return <section className="account-page"><div className="page-heading"><p className="route__eyebrow">Cuenta</p><h1>Tu perfil</h1><p>{profile.email}</p></div><form className="account-form" onSubmit={save}><div className="account-form__split"><label>Nombre<input name="firstName" defaultValue={profile.firstName} maxLength={50} required /></label><label>Apellido<input name="lastName" defaultValue={profile.lastName} maxLength={50} required /></label></div><label>Fecha de nacimiento <span className="field-hint">(opcional)</span><input name="birthDate" type="date" defaultValue={profile.birthDate ?? ''} /></label><label>Preferencia de tema<input name="theme" defaultValue={profile.theme ?? ''} maxLength={120} /></label><label>Personaje favorito<input name="character" defaultValue={profile.character ?? ''} maxLength={120} /></label><label className="check-field"><input name="notification" type="checkbox" defaultChecked={profile.notification} /> Quiero recibir mi historia de cumpleaños.</label>{message && <p className="form-message" role="status">{message}</p>}<button type="submit" disabled={pending}>{pending ? 'Guardando…' : 'Guardar perfil'}</button></form><section className="account-section" aria-labelledby="password-title"><h2 id="password-title">Cambiar contraseña</h2><form className="account-form" onSubmit={changePassword}><label>Contraseña actual<input name="currentPassword" type="password" autoComplete="current-password" required /></label><label>Nueva contraseña<input name="newPassword" type="password" autoComplete="new-password" minLength={8} required /></label><button type="submit" disabled={passwordPending}>{passwordPending ? 'Actualizando…' : 'Actualizar contraseña'}</button></form></section><section className="danger-zone"><h2>Desactivar cuenta</h2><p>Tu acceso deja de estar activo y se cerrará esta sesión.</p><button type="button" onClick={() => void deactivate()} disabled={pending}>Desactivar mi cuenta</button></section><p className="account-page__link"><Link href="/subscription">Gestionar notificaciones</Link></p></section>;
}
