import { AuthForm } from '@/features/account/auth-form';

export default function SignInPage() {
    return <main id="main-content" className="route"><p className="route__eyebrow">Acceso</p><h1>Inicia sesión</h1><p>Recupera tu biblioteca y gestiona tus preferencias desde una sesión segura.</p><AuthForm mode="sign-in" /></main>;
}
