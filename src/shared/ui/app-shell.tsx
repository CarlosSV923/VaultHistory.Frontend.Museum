import Link from 'next/link';
import type { ReactNode } from 'react';

const navigation = [
    { href: '/explore', label: 'Explorar' },
    { href: '/library', label: 'Biblioteca' },
    { href: '/sign-in', label: 'Iniciar sesión' },
    { href: '/register', label: 'Crear cuenta' },
];

export function AppShell({ children }: Readonly<{ children: ReactNode }>) {
    return <div className="shell"><header className="shell__header"><Link className="shell__brand" href="/explore">Vault History</Link><nav aria-label="Navegación principal" className="shell__nav">{navigation.map((item) => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav></header>{children}</div>;
}
