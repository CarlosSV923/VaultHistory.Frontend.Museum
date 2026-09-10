# VaultHistory.Frontend.Museum

Frontend web de Vault History. Este repositorio alojará la experiencia pública para explorar y generar historias, junto con las experiencias autenticadas de biblioteca, perfil y suscripción.

La aplicación se implementará con **Next.js** y TypeScript. El frontend usará rutas de servidor/BFF para comunicarse con los microservicios de User e History: los tokens de servicio y demás secretos nunca se expondrán al navegador.

## Arquitectura prevista

La base de la aplicación seguirá una separación sencilla y mantenible:

- `app/`: rutas, layouts y composición de pantallas con App Router.
- `features/`: casos de uso de producto, como generación anónima, autenticación y biblioteca.
- `entities/`: contratos y modelos de dominio del cliente.
- `shared/`: componentes visuales, utilidades, configuración y cliente HTTP.

La primera visita será una experiencia de visitante. No mostrará perfiles ni datos de ejemplo como si pertenecieran al usuario actual.

## Requisitos locales

La inicialización técnica se realizará en la siguiente historia. Para trabajar en este repositorio se requiere:

- Node.js LTS.
- Un gestor de paquetes compatible con el proyecto, definido al crear Next.js.
- Acceso a los servicios de Vault History o sus variables de entorno de desarrollo.

## Ramas y contribución

- `main` es la rama estable y predeterminada.
- `develop` integra el trabajo preparado para la siguiente entrega.
- Cada historia parte de `develop` en una rama con el formato `feature/task-<número>/<ajuste>`.
- Los cambios se integran mediante pull request: las ramas de funcionalidad se revisan contra `develop` y las entregas se promueven de `develop` a `main` mediante otro pull request.

Consulta [CONTRIBUTING.md](CONTRIBUTING.md) antes de abrir un cambio.
Next.js frontend for Vault History
