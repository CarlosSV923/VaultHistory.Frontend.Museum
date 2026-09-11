# VaultHistory.Frontend.Museum

Frontend web de Vault History. Este repositorio alojará la experiencia pública para explorar y generar historias, junto con las experiencias autenticadas de biblioteca, perfil y suscripción.

La aplicación usa **Next.js 16**, App Router y TypeScript. El frontend usará rutas de servidor/BFF para comunicarse con los microservicios de User e History: los tokens de servicio y demás secretos nunca se expondrán al navegador.

## Arquitectura prevista

La base ya organiza el código con una separación sencilla y mantenible:

- `app/`: rutas, layouts y composición de pantallas con App Router.
- `features/`: casos de uso de producto, como generación anónima, autenticación y biblioteca.
- `entities/`: contratos y modelos de dominio del cliente.
- `shared/`: componentes visuales, utilidades, configuración y cliente HTTP.

Las rutas iniciales están disponibles en `/explore`, `/library`, `/sign-in`, `/register`, `/profile` y `/subscription`. El App Router incorpora un estado global de carga y una frontera de error reutilizable. Cada pantalla es deliberadamente un estado inicial: las integraciones y formularios se agregan en sus historias correspondientes.

La primera visita será una experiencia de visitante. No mostrará perfiles ni datos de ejemplo como si pertenecieran al usuario actual.

## Requisitos locales

Para trabajar en este repositorio se requiere:

- Node.js LTS.
- pnpm 11.
- Acceso a los servicios de Vault History o sus variables de entorno de desarrollo.

```bash
pnpm install --frozen-lockfile
cp .env.example .env.local
pnpm dev
```

`USER_API_URL`, `HISTORY_API_URL` y `HISTORY_FRONTEND_TOKEN` son exclusivamente de servidor: no se deben renombrar con el prefijo `NEXT_PUBLIC_` ni incluir en el cliente. La sesión autenticada se conserva en una cookie HTTP-only y las rutas BFF reenvían las solicitudes autorizadas a User y History.

## Cuenta, biblioteca y suscripción

`/register` y `/sign-in` usan User desde rutas server-side y nunca guardan el JWT en `localStorage`. Las rutas `/library`, `/profile` y `/subscription` consumen únicamente las rutas BFF del frontend para listar, crear y retirar historias personales, actualizar perfil, contraseña y preferencias de cumpleaños. Una sesión vencida devuelve a inicio de sesión sin revelar historias de otra cuenta.

## Tema y accesibilidad

El control del encabezado alterna entre temas claro y oscuro. La elección se guarda en el navegador y un script previo a la hidratación aplica el tema para evitar destellos al cargar. La interfaz incorpora foco visible, navegación mediante teclado, un enlace para saltar a contenido y respeta la reducción de movimiento del sistema.

## Experiencia de visitante

`/explore` permite crear y recuperar historias anónimas a través de `/api/anonymous-histories`. Esta ruta BFF lee `HISTORY_API_URL` y `HISTORY_FRONTEND_TOKEN` exclusivamente en el servidor, resuelve la IP de la solicitud y reenvía el contrato requerido por History. El navegador nunca recibe ese token ni usa `localStorage` como fuente de verdad para la cuota.

Cuando History responde `429`, la interfaz muestra un diálogo con las opciones de crear cuenta, iniciar sesión o seguir explorando.

## Ramas y contribución

- `main` es la rama estable y predeterminada.
- `develop` integra el trabajo preparado para la siguiente entrega.
- Cada historia parte de `develop` en una rama con el formato `feature/task-<número>/<ajuste>`.
- Los cambios se integran mediante pull request: las ramas de funcionalidad se revisan contra `develop` y las entregas se promueven de `develop` a `main` mediante otro pull request.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir un cambio.
Next.js frontend for Vault History
