# Contribuir a Vault History Frontend

1. Actualiza tu copia de `develop`.
2. Crea una rama `feature/task-<número>/<ajuste>`.
3. Mantén los secretos en variables de entorno del servidor; no los incluyas en código, ejemplos públicos ni variables `NEXT_PUBLIC_*`.
4. Ejecuta `pnpm validate:env`, `pnpm lint`, `pnpm typecheck`, `pnpm test:unit`, `pnpm build` y `pnpm test:e2e`. Los E2E descargan Chromium mediante `pnpm exec playwright install chromium` la primera vez.
5. Abre un pull request hacia `develop` con la tarea vinculada, una descripción del cambio y evidencia de las validaciones aplicables. Usa la plantilla de PR y revisa el diseño en móvil y escritorio.
6. Promueve cambios revisados desde `develop` a `main` mediante pull request.

No se realizan integraciones directas en `main`.
