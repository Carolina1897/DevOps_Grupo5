-- MySQL dump 10.13  Distrib 8.0.38, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: dboautoconexion
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tblciudad`
--

DROP TABLE IF EXISTS `tblciudad`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblciudad` (
  `intIdCiudad` int NOT NULL AUTO_INCREMENT,
  `strCiudad` varchar(50) NOT NULL,
  PRIMARY KEY (`intIdCiudad`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblciudad`
--

LOCK TABLES `tblciudad` WRITE;
/*!40000 ALTER TABLE `tblciudad` DISABLE KEYS */;
INSERT INTO `tblciudad` VALUES (1,'Medellin'),(2,'Cali');
/*!40000 ALTER TABLE `tblciudad` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblciudadconcesionarios`
--

DROP TABLE IF EXISTS `tblciudadconcesionarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblciudadconcesionarios` (
  `intIdCiudadConcesionario` int NOT NULL AUTO_INCREMENT,
  `intIdCiudad` int NOT NULL,
  `intIdConcesionario` int NOT NULL,
  PRIMARY KEY (`intIdCiudadConcesionario`),
  KEY `intIdCiudad` (`intIdCiudad`),
  KEY `intIdConcesionario` (`intIdConcesionario`),
  CONSTRAINT `tblciudadconcesionarios_ibfk_1` FOREIGN KEY (`intIdCiudad`) REFERENCES `tblciudad` (`intIdCiudad`),
  CONSTRAINT `tblciudadconcesionarios_ibfk_2` FOREIGN KEY (`intIdConcesionario`) REFERENCES `tblconcesionario` (`intIdConcesionario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblciudadconcesionarios`
--

LOCK TABLES `tblciudadconcesionarios` WRITE;
/*!40000 ALTER TABLE `tblciudadconcesionarios` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblciudadconcesionarios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblconcesionario`
--

DROP TABLE IF EXISTS `tblconcesionario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblconcesionario` (
  `intIdConcesionario` int NOT NULL AUTO_INCREMENT,
  `strNombreConcesionario` varchar(100) NOT NULL,
  `strDireccionConcesionario` varchar(100) NOT NULL,
  `strEmail` varchar(100) NOT NULL,
  `strTelefonoConcesionario` varchar(100) NOT NULL,
  `strSitioWeb` varchar(100) NOT NULL,
  `intIdCiudad` int NOT NULL,
  PRIMARY KEY (`intIdConcesionario`),
  KEY `idx_concesionario_ciudad` (`intIdCiudad`),
  CONSTRAINT `tblconcesionario_ibfk_1` FOREIGN KEY (`intIdCiudad`) REFERENCES `tblciudad` (`intIdCiudad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblconcesionario`
--

LOCK TABLES `tblconcesionario` WRITE;
/*!40000 ALTER TABLE `tblconcesionario` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblconcesionario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblfavoritos`
--

DROP TABLE IF EXISTS `tblfavoritos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblfavoritos` (
  `intIdFavorito` int NOT NULL AUTO_INCREMENT,
  `bigintIdentificacionUs` bigint NOT NULL,
  `intCodigoVehiculo` int NOT NULL,
  PRIMARY KEY (`intIdFavorito`),
  KEY `bigintIdentificacionUs` (`bigintIdentificacionUs`),
  KEY `intCodigoVehiculo` (`intCodigoVehiculo`),
  CONSTRAINT `tblfavoritos_ibfk_1` FOREIGN KEY (`bigintIdentificacionUs`) REFERENCES `tblusuario` (`bigintIdentificacionUs`),
  CONSTRAINT `tblfavoritos_ibfk_2` FOREIGN KEY (`intCodigoVehiculo`) REFERENCES `tblvehiculos` (`intCodigoVehiculo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblfavoritos`
--

LOCK TABLES `tblfavoritos` WRITE;
/*!40000 ALTER TABLE `tblfavoritos` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblfavoritos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblmarca`
--

DROP TABLE IF EXISTS `tblmarca`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblmarca` (
  `intIdMarca` int NOT NULL AUTO_INCREMENT,
  `strMarca` varchar(100) NOT NULL,
  PRIMARY KEY (`intIdMarca`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblmarca`
--

LOCK TABLES `tblmarca` WRITE;
/*!40000 ALTER TABLE `tblmarca` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblmarca` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblusuario`
--

DROP TABLE IF EXISTS `tblusuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblusuario` (
  `bigintIdentificacionUs` bigint NOT NULL,
  `strNombreUs` varchar(100) NOT NULL,
  `strApellidoUs` varchar(100) NOT NULL,
  `strEmailUs` varchar(100) NOT NULL,
  `strContrasenaUs` varchar(100) NOT NULL,
  `strTelefonoUs` varchar(100) NOT NULL,
  `strDireccionUs` varchar(100) NOT NULL,
  `intIdCiudad` int NOT NULL,
  PRIMARY KEY (`bigintIdentificacionUs`),
  UNIQUE KEY `strEmailUs` (`strEmailUs`),
  KEY `intIdCiudad` (`intIdCiudad`),
  KEY `idx_email_usuario` (`strEmailUs`),
  CONSTRAINT `tblusuario_ibfk_1` FOREIGN KEY (`intIdCiudad`) REFERENCES `tblciudad` (`intIdCiudad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblusuario`
--

LOCK TABLES `tblusuario` WRITE;
/*!40000 ALTER TABLE `tblusuario` DISABLE KEYS */;
INSERT INTO `tblusuario` VALUES (1001,'LUISA','HERRERA','alejandrajime45@gmail.com','1234','3137771573','GUAYABAL LOS POMOS',1),(3456,'Dylan','Lopez','Dylan45@gmail.com','4321','3125654785','Bello',2),(12356467,'yuldor','gutierrez','yuidor56@gmail.com','yuldor','3137771573','GUAYABAL LOS POMOS',2);
/*!40000 ALTER TABLE `tblusuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tblvehiculos`
--

DROP TABLE IF EXISTS `tblvehiculos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tblvehiculos` (
  `intCodigoVehiculo` int NOT NULL AUTO_INCREMENT,
  `strDescripcion` varchar(200) NOT NULL,
  `enumTipoVehiculo` enum('NUEVO','USADO') NOT NULL,
  `strModelo` varchar(50) NOT NULL,
  `strAño` varchar(50) DEFAULT NULL,
  `enumCategoriaAuto` enum('AUTOMATICO','MECANICO') NOT NULL,
  `dateFechaPublicacion` date NOT NULL,
  `strPlaca` varchar(10) DEFAULT NULL,
  `dcmKilometraje` decimal(10,0) DEFAULT NULL,
  `intIdCiudad` int NOT NULL,
  `intIdMarca` int NOT NULL,
  `intIdConcesionario` int DEFAULT NULL,
  `bigintIdentificacionUs` bigint DEFAULT NULL,
  PRIMARY KEY (`intCodigoVehiculo`),
  UNIQUE KEY `strPlaca` (`strPlaca`),
  KEY `intIdMarca` (`intIdMarca`),
  KEY `intIdConcesionario` (`intIdConcesionario`),
  KEY `bigintIdentificacionUs` (`bigintIdentificacionUs`),
  KEY `idx_vehiculos_ciudad` (`intIdCiudad`),
  CONSTRAINT `tblvehiculos_ibfk_1` FOREIGN KEY (`intIdCiudad`) REFERENCES `tblciudad` (`intIdCiudad`),
  CONSTRAINT `tblvehiculos_ibfk_2` FOREIGN KEY (`intIdMarca`) REFERENCES `tblmarca` (`intIdMarca`),
  CONSTRAINT `tblvehiculos_ibfk_3` FOREIGN KEY (`intIdConcesionario`) REFERENCES `tblconcesionario` (`intIdConcesionario`),
  CONSTRAINT `tblvehiculos_ibfk_4` FOREIGN KEY (`bigintIdentificacionUs`) REFERENCES `tblusuario` (`bigintIdentificacionUs`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tblvehiculos`
--

LOCK TABLES `tblvehiculos` WRITE;
/*!40000 ALTER TABLE `tblvehiculos` DISABLE KEYS */;
/*!40000 ALTER TABLE `tblvehiculos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'dboautoconexion'
--

--
-- Dumping routines for database 'dboautoconexion'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-10-06 23:25:54
