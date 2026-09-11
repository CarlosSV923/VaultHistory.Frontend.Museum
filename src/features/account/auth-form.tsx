'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { responseMessage } from './request';

type AuthMode = 'sign-in' | 'register';

export function AuthForm({ mode }: { mode: AuthMode }) {
    const router = useRouter();
    const [message, setMessage] = useState<string | null>(null);
    const [pending, setPending] = useState(false);
    const isRegistration = mode === 'register';

    async function submit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const values = new FormData(event.currentTarget);
        const email = String(values.get('email') ?? '').trim();
        const password = String(values.get('password') ?? '');
        const firstName = String(values.get('firstName') ?? '').trim();
        const lastName = String(values.get('lastName') ?? '').trim();
        if (!email || !password) { setMessage('Introduce tu email y contraseña.'); return; }
        const payload = isRegistration ? {
            firstName,
            lastName,
            email,
            password,
            ...(values.get('birthDate') ? { birthDate: values.get('birthDate') } : {}),
            notification: values.get('notification') === 'on',
            ...(values.get('theme') ? { theme: String(values.get('theme')) } : {}),
            ...(values.get('character') ? { character: String(values.get('character')) } : {}),
        } : { email, password };
        if (isRegistration && (!firstName || !lastName)) { setMessage('Indica tu nombre y apellido.'); return; }
        setPending(true); setMessage(null);
        try {
            const response = await fetch(`/api/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!response.ok) { setMessage(await responseMessage(response, 'No pudimos iniciar tu sesión.')); return; }
            router.replace('/library');
            router.refresh();
        } catch { setMessage('No pudimos conectar con la cuenta. Inténtalo de nuevo.'); }
        finally { setPending(false); }
    }

    return <form className="account-form" onSubmit={submit} noValidate>
        {isRegistration && <div className="account-form__split"><label>Nombre<input name="firstName" autoComplete="given-name" maxLength={50} required /></label><label>Apellido<input name="lastName" autoComplete="family-name" maxLength={50} required /></label></div>}
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Contraseña<input name="password" type="password" autoComplete={isRegistration ? 'new-password' : 'current-password'} minLength={8} required /></label>
        {isRegistration && <><label>Fecha de nacimiento <span className="field-hint">(opcional)</span><input name="birthDate" type="date" /></label><label>Preferencias para tus historias <input name="theme" maxLength={120} placeholder="Ej. misterio" /></label><label>Personaje favorito <input name="character" maxLength={120} placeholder="Ej. una cartógrafa" /></label><label className="check-field"><input name="notification" type="checkbox" /> Quiero recibir mi historia de cumpleaños.</label></>}
        {message && <p className="form-message" role="alert">{message}</p>}
        <button type="submit" disabled={pending}>{pending ? 'Guardando…' : isRegistration ? 'Crear cuenta' : 'Iniciar sesión'}</button>
        <p className="account-form__switch">{isRegistration ? <>¿Ya tienes cuenta? <Link href="/sign-in">Inicia sesión</Link></> : <>¿Aún no tienes cuenta? <Link href="/register">Crea tu cuenta</Link></>}</p>
    </form>;
}
