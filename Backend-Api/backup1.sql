-- MySQL dump 10.13  Distrib 8.4.11, for Linux (x86_64)
--
-- Host: localhost    Database: decodulce
-- ------------------------------------------------------
-- Server version	8.4.11

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `cake`
--

DROP TABLE IF EXISTS `cake`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cake` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) NOT NULL,
  `categoria` varchar(255) NOT NULL,
  `descripcion` longtext NOT NULL,
  `imagen` varchar(255) DEFAULT NULL,
  `nombre` varchar(255) NOT NULL,
  `porciones` varchar(255) DEFAULT NULL,
  `precio_base` double NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cake`
--

LOCK TABLES `cake` WRITE;
/*!40000 ALTER TABLE `cake` DISABLE KEYS */;
INSERT INTO `cake` VALUES (1,_binary '','Clásicas','Bizcocho húmedo de cacao amargo, relleno de dulce de leche artesanal y cobertura de ganache.','https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80','Chocolate Clásico','10-12 porciones',1200),(2,_binary '','Especiales','Bizcocho de vainilla, crema chantilly y frutos rojos frescos.','https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=600&q=80','Frutos Rojos y Crema','12-15 porciones',1300),(3,_binary '','Clásicas','Bizcocho de vainilla, dulce de leche y corazón crocante de almendras.','https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80','Dulce de Leche Crunchy','10 porciones',1100),(4,_binary '','Especiales','Capas de chocolate, frosting de galletas Oreo y mini Oreos.','https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80','Torta Oreo Supreme','12 porciones',1250),(5,_binary '','Cumpleaños','Torta festiva de dos pisos con buttercream y detalles dorados.','https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?auto=format&fit=crop&w=600&q=80','Cumpleaños Temática Aniversario','20-25 porciones',2100),(6,_binary '','Especiales','Bizcocho rojo aterciopelado con frosting de queso crema.','https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80','Red Velvet Clásica','10-12 porciones',1400),(7,_binary '','Personalizadas','Torta a medida con diseño libre según la temática del evento.','https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80','Design Cake Personalizada','15 porciones',1800),(8,_binary '','Clásicas','Chocolinas, dulce de leche y queso crema en una receta clásica.','https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=600&q=80','Chocotorta Familiar','8-10 porciones',950),(11,_binary '','Clásicas','Super Tortota','https://imgs.search.brave.com/8cIvkm4UpGk4nmk8OQPgVF8YlPh18lZGKs0MeS16RAw/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9kZWxp/Z29nb3MuY29tL3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDIzLzA0/L1RvcnRhLUN1bXBs/ZWFub3MtTmluby1T/dXBlci1IZXJvZXMt/NjAweDYwMC5qcGc','Super Torta','10',2500),(12,_binary '','Especiales','Super Torta','https://imgs.search.brave.com/8uQ9SaazlmFGmTL540rWRx7W4Np61eOwXq-y65hQNgA/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2EyLzY3/L2FjL2EyNjdhY2Fi/NjFmODkyNTBlNmZm/YjI0NzdhNGFjMDgx/LmpwZw','Tortota de Cholatum','11',3000),(13,_binary '','Clásicas','Tortita','http://localhost:8080/uploads/cakes/b1d28493-4c28-4ade-80c6-c74aa4364d9b.png','Tortira','23',2500);
/*!40000 ALTER TABLE `cake` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contact_messages`
--

DROP TABLE IF EXISTS `contact_messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contact_messages` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` varchar(2000) NOT NULL,
  `name` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contact_messages`
--

LOCK TABLES `contact_messages` WRITE;
/*!40000 ALTER TABLE `contact_messages` DISABLE KEYS */;
/*!40000 ALTER TABLE `contact_messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `custom_cake_requests`
--

DROP TABLE IF EXISTS `custom_cake_requests`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `custom_cake_requests` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `estimated_price` decimal(12,2) NOT NULL,
  `filling` varchar(255) NOT NULL,
  `flavor` varchar(255) NOT NULL,
  `size` varchar(255) NOT NULL,
  `theme` varchar(1000) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `custom_cake_requests`
--

LOCK TABLES `custom_cake_requests` WRITE;
/*!40000 ALTER TABLE `custom_cake_requests` DISABLE KEYS */;
/*!40000 ALTER TABLE `custom_cake_requests` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_orders`
--

DROP TABLE IF EXISTS `customer_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_orders` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `notes` varchar(1000) DEFAULT NULL,
  `payment_method` enum('MERCADOPAGO','TRANSFER') NOT NULL,
  `phone` varchar(255) NOT NULL,
  `status` enum('CANCELLED','CONFIRMED','DELIVERED','IN_PREPARATION','PENDING','READY') NOT NULL,
  `total` decimal(12,2) NOT NULL,
  `transfer_reference` varchar(255) DEFAULT NULL,
  `transfer_receipt_filename` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_orders`
--

LOCK TABLES `customer_orders` WRITE;
/*!40000 ALTER TABLE `customer_orders` DISABLE KEYS */;
INSERT INTO `customer_orders` VALUES (1,'aaa','2026-09-29 23:41:29.832286','aaa','','MERCADOPAGO','1111','PENDING',1250.00,NULL,NULL);
/*!40000 ALTER TABLE `customer_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `favoritos`
--

DROP TABLE IF EXISTS `favoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `favoritos` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fecha_creacion` datetime(6) NOT NULL,
  `cake_id` bigint NOT NULL,
  `usuario_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKngrh7ghoyyedui5k8bu9crmms` (`usuario_id`,`cake_id`),
  KEY `FKri935kojnv7p5ieadtrtu3lnm` (`cake_id`),
  CONSTRAINT `FK56alt5d1tkxygcq7pddsqg2qu` FOREIGN KEY (`usuario_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKri935kojnv7p5ieadtrtu3lnm` FOREIGN KEY (`cake_id`) REFERENCES `cake` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `favoritos`
--

LOCK TABLES `favoritos` WRITE;
/*!40000 ALTER TABLE `favoritos` DISABLE KEYS */;
/*!40000 ALTER TABLE `favoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `imagenes_cake`
--

DROP TABLE IF EXISTS `imagenes_cake`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `imagenes_cake` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `fecha_creacion` datetime(6) NOT NULL,
  `url` longtext NOT NULL,
  `cake_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKatgilr941qdc8466mua8umfpv` (`cake_id`),
  CONSTRAINT `FKatgilr941qdc8466mua8umfpv` FOREIGN KEY (`cake_id`) REFERENCES `cake` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `imagenes_cake`
--

LOCK TABLES `imagenes_cake` WRITE;
/*!40000 ALTER TABLE `imagenes_cake` DISABLE KEYS */;
/*!40000 ALTER TABLE `imagenes_cake` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cake_id` bigint DEFAULT NULL,
  `custom_filling` varchar(255) DEFAULT NULL,
  `custom_flavor` varchar(255) DEFAULT NULL,
  `custom_size` varchar(255) DEFAULT NULL,
  `custom_theme` varchar(1000) DEFAULT NULL,
  `product_name` varchar(255) NOT NULL,
  `quantity` int NOT NULL,
  `unit_price` decimal(12,2) NOT NULL,
  `order_id` bigint NOT NULL,
  `portions` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKb2vrrqy10nnyqhb5ergl5498r` (`order_id`),
  CONSTRAINT `FKb2vrrqy10nnyqhb5ergl5498r` FOREIGN KEY (`order_id`) REFERENCES `customer_orders` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
INSERT INTO `order_items` VALUES (1,4,NULL,NULL,NULL,NULL,'Torta Oreo Supreme',1,1250.00,1,NULL);
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `activo` bit(1) NOT NULL,
  `email` varchar(255) NOT NULL,
  `fecha_creacion` datetime(6) NOT NULL,
  `nombre` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `rol` varchar(255) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,_binary '','admin@gmail.com','2026-09-29 20:55:09.090597','Administrador Deco Dulce','$2a$10$gl4yoNoYhAkMxQ3BrAyjNer8aGjd5VoIzvXnj2puApM32pLKQYiCe','ROLE_ADMIN');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-05 15:52:11
