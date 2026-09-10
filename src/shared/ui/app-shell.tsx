import Link from 'next/link';
import type { ReactNode } from 'react';

const navigation = [
    { href: '/explorar', label: 'Explorar' },
    { href: '/biblioteca', label: 'Biblioteca' },
    { href: '/iniciar-sesion', label: 'Iniciar sesión' },
    { href: '/registro', label: 'Crear cuenta' },
];

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
    return <div className="shell"><header className="shell__header"><Link className="shell__brand" href="/explorar">Vault History</Link><nav aria-label="Navegación principal" className="shell__nav">{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav></header>{children}</div>;
}
