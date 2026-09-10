# VaultHistory.Frontend.Museum

Frontend web de Vault History. Este repositorio alojará la experiencia pública para explorar y generar historias, junto con las experiencias autenticadas de biblioteca, perfil y suscripción.

La aplicación usa **Next.js 16**, App Router y TypeScript. El frontend usará rutas de servidor/BFF para comunicarse con los microservicios de User e History: los tokens de servicio y demás secretos nunca se expondrán al navegador.

## Arquitectura prevista

La base ya organiza el código con una separación sencilla y mantenible:

- `app/`: rutas, layouts y composición de pantallas con App Router.
- `features/`: casos de uso de producto, como generación anónima, autenticación y biblioteca.
- `entities/`: contratos y modelos de dominio del cliente.
- `shared/`: componentes visuales, utilidades, configuración y cliente HTTP.

Las rutas iniciales están disponibles en `/explorar`, `/biblioteca`, `/iniciar-sesion`, `/registro`, `/perfil` y `/suscripcion`. El App Router incorpora un estado global de carga y una frontera de error reutilizable. Cada pantalla es deliberadamente un estado inicial: las integraciones y formularios se agregan en sus historias correspondientes.

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

`NEXT_PUBLIC_HISTORY_API_URL` y `NEXT_PUBLIC_USER_API_URL` son orígenes públicos configurables. `HISTORY_FRONTEND_TOKEN` es exclusivamente de servidor: no se debe renombrar con el prefijo `NEXT_PUBLIC_` ni incluir en el cliente.

## Ramas y contribución

- `main` es la rama estable y predeterminada.
- `develop` integra el trabajo preparado para la siguiente entrega.
- Cada historia parte de `develop` en una rama con el formato `feature/task-<número>/<ajuste>`.
- Los cambios se integran mediante pull request: las ramas de funcionalidad se revisan contra `develop` y las entregas se promueven de `develop` a `main` mediante otro pull request.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir un cambio.
Next.js frontend for Vault History
