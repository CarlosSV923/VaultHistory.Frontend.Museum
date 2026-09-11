# Despliegue y seguridad

## Configuración

Configura estos valores únicamente en el entorno de servidor o almacén de secretos de la plataforma. No confirmes `.env.local` ni uses el prefijo `NEXT_PUBLIC_` para ellos.

| Variable | Propósito |
| --- | --- |
| `USER_API_URL` | Origen interno o confiable del servicio User. |
| `HISTORY_API_URL` | Origen interno o confiable del servicio History. |
| `HISTORY_FRONTEND_TOKEN` | Token exclusivo de servidor del flujo BFF anónimo de History. |

Ejecuta `pnpm validate:env` antes del despliegue local. Valida nombres requeridos y formato de URL sin imprimir valores configurados. CI usa valores placeholder únicamente para validar la forma de la configuración; los valores productivos pertenecen al almacén de secretos de la plataforma.

## Límite BFF y CORS

El navegador se comunica exclusivamente con rutas same-origin `/api/*`. Los route handlers de Next.js adjuntan un token de servicio de servidor o leen la cookie HTTP-only del usuario autenticado antes de reenviar a User o History. Los JWT y tokens de servicio no se devuelven al JavaScript del navegador ni se guardan en almacenamiento del navegador.

El frontend no habilita CORS permisivo para endpoints BFF. Si User o History se despliegan en otro origen, permite solo el origen confiable del frontend/BFF en el límite del servicio, o preferiblemente conserva la red de servicios como privada. Nunca aceptes una URL upstream, identidad o IP de visitante elegida por el cliente como sustituto de autorización.

## Cabeceras y caché

`next.config.ts` deshabilita `X-Powered-By` y añade CSP, políticas de frame, contenido, referrer, permisos, DNS-prefetch y cross-origin opener a todas las rutas. La CSP actual conserva `unsafe-inline` solo porque el bootstrap de tema se ejecuta antes de hidratar; evita nuevo código inline para poder retirar esta excepción con una política basada en nonce.

Todas las respuestas `/api/*` tienen `Cache-Control: private, no-store, max-age=0`. Los fetch BFF también usan explícitamente `no-store`, de modo que datos de cuenta, listas protegidas por JWT y cuotas anónimas no pueden compartirse mediante una caché intermedia. Next.js mantiene su política normal de caché inmutable para recursos estáticos con hash.

## Errores y operación

Los route handlers reenvían estado HTTP y payload de error seguro a la interfaz. La UI distingue validación, sesión vencida, límite de cuota y fallos transitorios de red, y muestra reintento o inicio de sesión cuando corresponde. No registres cuerpos de petición, cabeceras de autorización, cookies, variables de entorno ni respuestas sin redactar de proveedores.

Para un release productivo ejecuta `pnpm audit:dependencies` y `pnpm verify`, inspecciona traza o screenshot de Playwright si falla un E2E y confirma que la plantilla del PR registre revisión responsive y cambios de contrato User o History. El workflow de GitHub Actions repite estos controles y audita dependencias antes de integración.
