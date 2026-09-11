import { AuthForm } from '@/features/account/auth-form';

export default function RegisterPage() {
    return <main id="main-content" className="route"><p className="route__eyebrow">Nueva cuenta</p><h1>Crea tu cuenta</h1><p>Conserva tus historias y elige cómo recibir las próximas.</p><AuthForm mode="register" /></main>;
}
