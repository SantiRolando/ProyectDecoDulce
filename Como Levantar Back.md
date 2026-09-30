Implementé el backend completo basado en el frontend:

Catálogo persistente de tortas con carga inicial.
Pedidos y detalle de productos en MySQL.
Precios calculados en servidor, incluyendo tortas personalizadas.
Formularios de contacto y solicitudes personalizadas.
Autenticación JWT y permisos para administración.
CORS configurable.
Docker Compose para MySQL.
Pruebas de contexto con H2.
Archivos principales: README.md, docker-compose.yml y application.properties.

Para ejecutarlo:
cd Backend-Api
docker compose up -d mysql
mvn spring-boot:run

Validación realizada: mvn test pasa correctamente. El frontend todavía usa datos hardcodeados; la API ya está
