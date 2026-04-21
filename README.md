🎂 DecoDulce - Backend API

API REST desarrollada para la gestión de tortas, implementando autenticación JWT y buenas prácticas de desarrollo backend con Spring Boot.

🚀 Tecnologías utilizadas
Java 17+
Spring Boot
Spring Security
JWT (Json Web Token)
Spring Data JPA
Hibernate
MySQL / H2 (según tu configuración)
Maven
📌 Funcionalidades
🔐 Autenticación con JWT
👤 Manejo de usuarios y roles (ADMIN / USER)
🎂 CRUD completo de tortas
🛡️ Protección de endpoints con Spring Security
📦 Arquitectura en capas (Controller, Service, Repository)
✅ Manejo de errores y códigos HTTP
📁 Estructura del Proyecto
src/
 ├── controller
 ├── service
 ├── repository
 ├── model
 ├── dto
 ├── configuration
 └── security
⚙️ Cómo levantar el proyecto
1️⃣ Clonar el repositorio
git clone https://github.com/TU-USUARIO/TU-REPOSITORIO.git
2️⃣ Entrar al proyecto
cd nombre-del-proyecto
3️⃣ Configurar la base de datos

Editar el archivo:

src/main/resources/application.properties

Ejemplo:

spring.datasource.url=jdbc:mysql://localhost:3306/decodulce
spring.datasource.username=root
spring.datasource.password=1234

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
4️⃣ Ejecutar el proyecto

Desde terminal:

mvn spring-boot:run

O desde tu IDE (IntelliJ / Eclipse / VS Code):

Ejecutar la clase:

DecoDulceApiApplication.java
🔐 Autenticación

Primero debes loguearte para obtener el token JWT.

Login
POST /auth/login

Body:

{
  "username": "admin",
  "password": "1234"
}

Response:

{
  "token": "JWT_TOKEN"
}

Luego usar el token en los headers:

Authorization: Bearer TOKEN
🎂 Endpoints principales
Tortas
Método	Endpoint	Descripción
GET	/api/cakes	Listar tortas
GET	/api/cakes/{id}	Obtener torta
POST	/api/cakes	Crear torta
PUT	/api/cakes/{id}	Actualizar torta
DELETE	/api/cakes/{id}	Eliminar torta
🧪 Pruebas

Las pruebas fueron realizadas utilizando:

Postman
🖥️ Frontend

El frontend del proyecto se encuentra actualmente en desarrollo y será integrado próximamente para consumir esta API.

👨‍💻 Autor

Santiago Rolando
Backend Developer en formación 🚀

📌 Estado del Proyecto

🚧 En desarrollo
✔ Backend funcional
🛠 Frontend en proceso
