# Contexto del proyecto Deco Dulce

Documento de traspaso para que una persona o una IA pueda entender el sistema, ejecutarlo y continuar el trabajo sin depender del historial de conversaciones.

## 1. Resumen

Deco Dulce es una tienda web de tortas artesanales. El repositorio contiene:

- Un backend REST con Spring Boot 4, Java 21, Spring Security/JWT, JPA y MySQL 8.4.
- Un frontend SPA con React, TypeScript, Vite y React Router.
- Un panel de administración para ingresar, cargar imágenes al backend, crear tortas y revisar el catálogo.
- Flujos de catálogo, carrito/checkout, pedidos, tortas personalizadas y contacto.

La raíz de este repositorio está en `Poryect/`. Los nombres `Poryect`, `Backend-Api` e `inmobiliaria-noel-api` son nombres heredados; no describen el producto actual.

## 2. Estructura

```text
Poryect/
├── CONTEXTO_PROYECTO.md
├── README.md                         # Actualmente vacío
├── Como Levantar Back.md             # Notas anteriores, parcialmente desactualizadas
├── .gitignore
├── Backend-Api/
│   ├── pom.xml
│   ├── docker-compose.yml
│   └── src/main/java/com/example/DecoDulce_Api/
│       ├── configuration/            # Seguridad, datos iniciales, archivos subidos
│       ├── controller/               # REST API
│       ├── dtos/
│       ├── model/                    # Entidades JPA
│       ├── repository/
│       ├── service/
│       └── util/                     # JWT y filtro
└── Frontend-Proyect/tortas-front-app/
    ├── package.json
    └── src/
        ├── App.tsx                   # Rutas
        ├── components/               # Carrito, footer
        ├── context/                  # Estado del carrito
        ├── pages/                    # Tienda, admin, páginas legales
        └── services/api.ts           # Cliente HTTP y mapeo de DTOs
```

## 3. Requisitos y arranque local

Requisitos: Java 21, Maven 3.9 o equivalente, Node.js compatible con Vite 8, pnpm y Docker/Compose si se usa la base MySQL en contenedor.

### Base de datos

Desde `Backend-Api/`:

```bash
docker compose up -d mysql
```

El Compose actual publica MySQL 8.4 en `localhost:3306`, crea la base `decodulce` y el usuario de desarrollo `decodulce`. El volumen `decodulce_mysql` conserva los datos aunque se reinicie el contenedor. No borrar ese volumen si se quieren conservar las tortas, usuarios y pedidos.

`DataInitializer` carga ocho tortas de muestra solamente cuando la tabla de tortas está vacía. Si la tabla ya contiene registros, no los reemplaza ni agrega nuevamente esas muestras.

### Backend

Desde `Backend-Api/`:

```bash
mvn spring-boot:run
```

API local: `http://localhost:8080`. El Maven Wrapper (`mvnw`) está en el proyecto, pero anteriormente faltaba `.mvn/wrapper/maven-wrapper.properties`; si sigue incompleto, usar Maven instalado globalmente.

### Usuario administrador

El arranque puede crear un administrador si `ADMIN_EMAIL` aún no existe en la base. Las propiedades actuales contienen valores de desarrollo directamente en `application.properties`; consultar ese archivo localmente para conocerlos y **cambiarlos antes de compartir, desplegar o exponer el entorno**. Las variables de entorno tienen precedencia:

```bash
ADMIN_EMAIL=admin@decodulce.com ADMIN_PASSWORD='cambiar-por-una-clave-segura' mvn spring-boot:run
```

Importante: el inicializador **no actualiza** contraseña, nombre ni rol si ya existe un usuario con ese email. Cambiar las propiedades no restablece una cuenta existente. Para cambiar credenciales existentes hay que hacerlo mediante un flujo de administración seguro o con una operación controlada sobre la base.

### Frontend

Desde `Frontend-Proyect/tortas-front-app/`:

```bash
pnpm install
pnpm dev --host 0.0.0.0
```

Vite usa normalmente `http://localhost:5173`. El frontend apunta a `http://localhost:8080/api`; se puede cambiar con `VITE_API_URL`, que debe incluir la ruta `/api` si se mantiene la forma actual del cliente.

Comandos útiles:

```bash
pnpm build
pnpm lint
```

Para el backend:

```bash
mvn test
mvn -DskipTests package
```

Las pruebas de Spring usan H2 en memoria (`src/test/resources/application.properties`), no la base MySQL de desarrollo.

## 4. Configuración actual

Configuración backend principal: `Backend-Api/src/main/resources/application.properties`.

- `DB_URL`, `DB_USERNAME`, `DB_PASSWORD`: conexión MySQL. El valor actual por defecto usa `localhost:3306/decodulce`.
- `JWT_SECRET`, `JWT_EXPIRATION`: firma y duración del JWT. No usar el secreto de desarrollo en producción.
- `CORS_ALLOWED_ORIGINS`: por defecto permite el origen Vite `http://localhost:5173`.
- `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`: alta inicial de administrador.
- `UPLOADS_DIRECTORY`: directorio local de imágenes; por defecto `uploads/cakes` relativo al directorio desde el que se arranca el backend.
- Límite multipart: 8 MB por archivo y 9 MB por request.

**Discrepancia conocida:** el README dentro de `Backend-Api` menciona el puerto `3307`, pero el `docker-compose.yml` y `application.properties` actuales usan `3306`. Para cambiar de puerto hay que actualizar coherentemente el mapeo de Compose y `DB_URL`; no confiar en esa línea vieja del README.

## 5. Rutas del frontend

- `/`: portada y tortas destacadas; consume `GET /api/cakes`.
- `/catalog`: catálogo con búsqueda/categorías y detalle; consume la API.
- `/customcake`: solicitud de torta personalizada.
- `/about`: información del negocio.
- `/contact`: formulario de contacto.
- `/checkout`: flujo de checkout/pedido.
- `/admin`: login y gestión de catálogo.
- `/legal/terminos` y `/legal/privacidad`: documentos legales base.

El carrito se mantiene en `CartContext`. El pie de sitio común se agrega desde `App.tsx`; no aparece en `/admin`, donde hay un pie propio.

El cliente centralizado está en `src/services/api.ts`. Convierte el modelo JSON del backend (`nombre`, `descripcion`, `precioBase`, `imagen`, etc.) al modelo que usa la tienda (`name`, `description`, `price`, `imageUrl`). No quitar ese mapeo sin revisar todas las páginas.

## 6. API y comportamiento

### Catálogo e imágenes

- `GET /api/cakes`: catálogo público completo; devuelve una lista sin paginar. Es el que usan las páginas públicas.
- `GET /api/cakes/{id}`: consulta por ID.
- `GET /api/cakes/admin/page?page=0&size=12`: catálogo paginado para admin; tamaño limitado en servidor a 1..50, orden por ID descendente. Requiere `ROLE_ADMIN` o `ROLE_GESTOR`.
- `POST /api/cakes/images`: multipart form-data con campo `image`, requiere JWT y rol administrativo. Acepta JPG, PNG y GIF, valida decodificación, tamaño y dimensiones, guarda con nombre aleatorio y devuelve `{ "url": "/uploads/cakes/..." }`.
- `GET /uploads/cakes/{archivo}`: sirve públicamente la imagen guardada. El registro de la torta conserva esa ruta en el campo `imagen`.
- `POST /api/cakes/newCake`: JSON con `nombre`, `descripcion`, `precioBase`, `imagen`, `categoria`, `porciones`; requiere rol administrativo.
- `PUT /api/cakes/updateCake/{id}`: actualización; requiere rol administrativo.
- `DELETE /api/cakes/deleteCake/{id}`: eliminación; requiere `ROLE_ADMIN`.

El panel sube primero el archivo y luego crea la torta con la URL devuelta. Si falla el segundo paso, actualmente puede quedar un archivo huérfano sin registro asociado.

### Login y permisos

- `POST /api/auth/login`, JSON esperado: `{ "email": "...", "password": "..." }`.
- La respuesta es un string con formato `TOKEN: <JWT>`. El frontend elimina el prefijo, lee el claim `role` y guarda el token en `localStorage` bajo `decodulce_admin_token`.
- `POST /api/auth/register` es público, pero el servicio fuerza `ROLE_USER`; no se debe permitir que el cliente otorgue a sí mismo roles privilegiados.
- El problema histórico del login era que `DtoUser` exponía campos con inicial mayúscula (`Email`, `Password`). Ahora están en camelCase minúsculo, alineados con JSON.
- `GET /api/health`: respuesta pública `{ "status": "UP" }`, usada por el panel para verificar conectividad.
- Las operaciones de admin esperan roles `ROLE_ADMIN` o `ROLE_GESTOR` en el claim JWT.

El frontend almacena el token en `localStorage`; el logout lo elimina. No hay un endpoint de refresh. El token vence según `jwt.expiration`.

### Pedidos y formularios

- `POST /api/orders`: pedido validado; el servidor crea el pedido y sus ítems, calcula precios desde el catálogo y devuelve el resultado.
- `GET /api/orders/{id}`: consulta pública de pedido por ID.
- `GET /api/orders`: listado administrativo (`ROLE_ADMIN`/`ROLE_GESTOR`).
- `PATCH /api/orders/{id}/status/{status}`: cambio de estado administrativo.
- `POST /api/custom-cakes`: persiste solicitud personalizada y calcula precio estimado según tamaño.
- `POST /api/contact`: guarda un mensaje.
- `GET /api/contact`: listado para administración.

Entidades principales: `Cake`, `User`, `CustomerOrder`, `OrderItem`, `ContactMessage`, `CustomCakeRequest`; estados de pedido y método de pago son enums.

## 7. Persistencia de imágenes

Las imágenes no se almacenan en MySQL, sino como archivos locales. El código actual usa `UPLOADS_DIRECTORY` o `Backend-Api/uploads/cakes` si se arranca desde el directorio del backend. La carpeta está ignorada por Git.

Para producción o Docker, configurar un volumen persistente o un almacenamiento de objetos y respaldarlo junto con la base. Sin esto, una recreación del contenedor o cambio de máquina puede dejar las URLs de la base apuntando a archivos que ya no existen.

## 8. Estado comprobado y pendientes

En la última validación funcional se comprobó:

- El login con JSON en minúsculas devuelve HTTP 200 y rol `ROLE_ADMIN`.
- La API de catálogo/paginación respondió y el panel mostró 10 tortas existentes en la base de ese entorno. El número puede cambiar.
- Subida multipart devolvió HTTP 201 y la URL de imagen respondió HTTP 200. El archivo de prueba se eliminó.
- `/api/health` respondió HTTP 200.
- `mvn test` y `pnpm build` pasaron. En esta etapa hay una prueba de carga de contexto backend; la cobertura funcional específica es limitada.

Pendientes recomendados:

1. Reemplazar credenciales/secreto de desarrollo y documentar variables en `.env.example` sin valores secretos.
2. Corregir README de backend: puerto actual `3306`, comandos reales y endpoints de imágenes/paginación.
3. Completar y revisar legalmente los textos de términos y privacidad. Las páginas actuales declaran explícitamente que son borradores y contienen instrucciones por completar.
4. Añadir persistencia de imágenes si el backend se ejecutará dentro de Docker/servidor efímero; limpiar archivos huérfanos si falla el alta de torta.
5. Considerar paginar también `GET /api/cakes` público si el catálogo puede crecer; actualmente el endpoint público trae todo.
6. Añadir pruebas para login, autorización, paginación, carga de formatos válidos/inválidos y flujo crear-torta.
7. Revisar creación de pedidos en frontend y asegurar que el checkout consuma el backend de punta a punta; verificar pagos/WhatsApp antes de producción.

## 9. Precauciones al continuar

- El árbol Git está sucio: hay cambios locales y archivos generados en `Backend-Api/target/`. También aparecen eliminaciones de archivos de una carpeta vecina `Deco-FrontEnd/`. **No ejecutar `git clean`, `git reset --hard` ni restauraciones masivas** sin revisar y confirmar primero con el propietario.
- Algunos documentos (`README.md` raíz vacío y `Como Levantar Back.md`) son antiguos o incompletos. Contrastar siempre con `application.properties`, Compose y el código vigente.
- No subir a Git archivos `.env`, contraseñas, tokens, imágenes de usuarios/clientes ni datos reales de pedidos.
- La página legal debe adecuarse a la entidad y normativa aplicables; el texto actual es solo una base de interfaz.

## 10. Primeros pasos para una nueva persona o IA

1. Leer este documento y comprobar `git status` antes de modificar nada.
2. Leer `application.properties`, `docker-compose.yml` y `SecurityConfig.java` para confirmar puertos, CORS y permisos vigentes.
3. Iniciar MySQL, backend y frontend con los comandos de la sección 3.
4. Comprobar `GET http://localhost:8080/api/health` y abrir `http://localhost:5173/admin`.
5. Para un cambio funcional, seguir primero el flujo en `services/api.ts`, el controlador correspondiente y el servicio backend.
6. Validar con `mvn test` y `pnpm build`; probar en navegador los flujos que afecten al usuario.