# DecoDulce API

Backend Spring Boot 4 + Java 21 + MySQL para el catálogo y el flujo de compra de DecoDulce.

## Ejecutar MySQL y la API

Desde `Backend-Api`:

```bash
docker compose up -d mysql
mvn spring-boot:run
```

La API queda disponible en `http://localhost:8080`.

Para habilitar el panel de administración, configura `ADMIN_EMAIL` y `ADMIN_PASSWORD` antes de arrancar la API. Si ese email aún no existe, se crea un usuario `ROLE_ADMIN` al iniciar; las cuentas ya existentes no se modifican. Por ejemplo:

```bash
ADMIN_EMAIL=admin@decodulce.com ADMIN_PASSWORD='elige-una-clave-segura' mvn spring-boot:run
```

La publicación local de MySQL usa el puerto `3307` (`DB_URL` permite cambiarlo).

La configuración usa `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`, `JWT_SECRET` y `CORS_ALLOWED_ORIGINS`. En desarrollo, los valores por defecto coinciden con `docker-compose.yml` salvo que se sobrescriban.

## Endpoints principales

- `GET /api/cakes`: catálogo público.
- `POST /api/orders`: crea un pedido; el servidor recalcula los precios y persiste sus ítems.
- `GET /api/orders/{id}`: consulta el estado de un pedido.
- `POST /api/custom-cakes`: guarda una solicitud personalizada y calcula su precio por tamaño.
- `POST /api/contact`: guarda un mensaje del formulario de contacto.
- `POST /api/auth/register` y `POST /api/auth/login`: autenticación JWT.

Las operaciones de administración de catálogo, pedidos y mensajes requieren un usuario con rol `ADMIN` o `GESTOR`.

Las imágenes se cargan desde el panel como JPG, PNG o GIF (hasta 8 MB), se guardan en `Backend-Api/uploads/cakes` y quedan disponibles bajo `/uploads/cakes/{archivo}`. El directorio puede cambiarse con `UPLOADS_DIRECTORY`; los archivos no se guardan en la base de datos.

El listado administrativo usa `GET /api/cakes/admin/page?page=0&size=12`, autenticado y con máximo de 50 elementos por página. El catálogo público conserva `GET /api/cakes`.

## Pedido de ejemplo

```json
{
  "customerName": "María Pérez",
  "phone": "099123456",
  "address": "Calle 1, Maldonado",
  "paymentMethod": "TRANSFER",
  "transferReference": "98765432",
  "items": [{ "cakeId": 1, "quantity": 2 }]
}
```