import Link from 'next/link';
import type { ReactNode } from 'react';
import { ThemeToggle } from '@/shared/theme/theme-toggle';

const navigation = [
    { href: '/explore', label: 'Explorar' },
    { href: '/library', label: 'Biblioteca' },
    { href: '/profile', label: 'Perfil' },
    { href: '/subscription', label: 'Suscripción' },
    { href: '/sign-in', label: 'Iniciar sesión' },
    { href: '/register', label: 'Crear cuenta' },
];

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
    return <div className="shell"><a className="skip-link" href="#main-content">Saltar al contenido</a><header className="shell__header"><Link className="shell__brand" href="/explore"><span aria-hidden="true">VH</span><span>Vault History</span></Link><nav aria-label="Navegación principal" className="shell__nav">{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav><ThemeToggle /></header>{children}</div>;
}
