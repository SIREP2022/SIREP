-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 28-03-2022 a las 21:08:53
-- Versión del servidor: 10.4.22-MariaDB
-- Versión de PHP: 8.1.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `produccion`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `bodega`
--

CREATE TABLE `bodega` (
  `id_bodega` int(11) NOT NULL,
  `fecha` datetime DEFAULT NULL,
  `cantidad` int(11) DEFAULT NULL,
  `fk_inventario` int(11) DEFAULT NULL,
  `fk_produccion` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `cargo`
--

CREATE TABLE `cargo` (
  `idcargo` int(11) NOT NULL,
  `nombre_cargo` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Volcado de datos para la tabla `cargo`
--

INSERT INTO `cargo` (`idcargo`, `nombre_cargo`) VALUES
(1, 'Aprendiz'),
(2, 'Instructor'),
(3, 'Administrativos'),
(4, 'externo');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `compra`
--

CREATE TABLE `compra` (
  `Id_compra` int(11) NOT NULL,
  `Estado` enum('Reserva','Compra') DEFAULT NULL,
  `Fecha` date DEFAULT NULL,
  `fk_persona` bigint(15) NOT NULL,
  `tipo` enum('Grupal','Individual') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `detalle`
--

CREATE TABLE `detalle` (
  `id_detalle` int(11) NOT NULL,
  `cantidad` int(11) NOT NULL,
  `valor` decimal(10,2) NOT NULL,
  `Entregado` enum('Si','No') DEFAULT NULL,
  `Persona` bigint(15) DEFAULT NULL,
  `fk_Id_compra` int(11) NOT NULL,
  `fk_id_inventario` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventario`
--

CREATE TABLE `inventario` (
  `id_inventario` int(11) NOT NULL,
  `stock` int(11) NOT NULL,
  `fk_codigo_pdto` int(11) NOT NULL,
  `fk_id_punto_vent` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `percios`
--

CREATE TABLE `percios` (
  `fk_cargo` int(11) DEFAULT NULL,
  `fk_producto` int(11) DEFAULT NULL,
  `precio` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `personas`
--

CREATE TABLE `personas` (
  `identificacion` bigint(15) NOT NULL,
  `Nombres` varchar(80) NOT NULL,
  `Correo` varchar(30) DEFAULT NULL,
  `Login` varchar(20) NOT NULL,
  `Password` varchar(15) NOT NULL,
  `Direccion` varchar(40) DEFAULT NULL,
  `Telefono` varchar(15) DEFAULT NULL,
  `Cargo` int(11) DEFAULT NULL,
  `Rol` enum('Cliente','Lider Ficha','Unidad Productiva','Produccion','Punto Venta') DEFAULT NULL,
  `Ficha` int(11) DEFAULT NULL,
  `personascol` varchar(45) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `produccion`
--

CREATE TABLE `produccion` (
  `Id_produccion` int(11) NOT NULL,
  `Estado` enum('Aprobada','Rechazada') DEFAULT NULL,
  `Cantidad` int(11) NOT NULL,
  `fecha` date NOT NULL,
  `Observacion` varchar(50) DEFAULT NULL,
  `fk_codigo_pdto` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `productos`
--

CREATE TABLE `productos` (
  `Codigo_pdto` int(11) NOT NULL,
  `Nombre` varchar(50) NOT NULL,
  `Descripcion` varchar(80) DEFAULT NULL,
  `imagen` varchar(80) DEFAULT NULL,
  `Estado` enum('Activo','Inactivo') DEFAULT NULL,
  `Reserva` enum('Si','No') DEFAULT NULL,
  `fk_codigo_up` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `punto_venta`
--

CREATE TABLE `punto_venta` (
  `Id_punto_vent` int(11) NOT NULL,
  `Sede` enum('centro','Yamboro') NOT NULL,
  `Direccion` varchar(30) NOT NULL,
  `Nombre` varchar(30) DEFAULT NULL,
  `fk_persona` bigint(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `unidades_productivas`
--

CREATE TABLE `unidades_productivas` (
  `codigo_up` int(11) NOT NULL,
  `Nombre` varchar(40) NOT NULL,
  `Logo` varchar(80) DEFAULT NULL,
  `Descripcion` varchar(100) DEFAULT NULL,
  `sede` enum('Yamboro','Centro') DEFAULT NULL,
  `fk_persona` bigint(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `bodega`
--
ALTER TABLE `bodega`
  ADD PRIMARY KEY (`id_bodega`),
  ADD KEY `bodega_inventario_idx` (`fk_inventario`),
  ADD KEY `bodega_produccion_idx` (`fk_produccion`);

--
-- Indices de la tabla `cargo`
--
ALTER TABLE `cargo`
  ADD PRIMARY KEY (`idcargo`);

--
-- Indices de la tabla `compra`
--
ALTER TABLE `compra`
  ADD PRIMARY KEY (`Id_compra`),
  ADD KEY `comprar` (`fk_persona`);

--
-- Indices de la tabla `detalle`
--
ALTER TABLE `detalle`
  ADD PRIMARY KEY (`id_detalle`),
  ADD KEY `tiene_1` (`fk_Id_compra`),
  ADD KEY `tiene_2` (`fk_id_inventario`);

--
-- Indices de la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD PRIMARY KEY (`id_inventario`),
  ADD KEY `tiene_3` (`fk_id_punto_vent`),
  ADD KEY `tiene_4` (`fk_codigo_pdto`);

--
-- Indices de la tabla `percios`
--
ALTER TABLE `percios`
  ADD KEY `precio_cargo_idx` (`fk_cargo`),
  ADD KEY `precio_prodcuto_idx` (`fk_producto`);

--
-- Indices de la tabla `personas`
--
ALTER TABLE `personas`
  ADD PRIMARY KEY (`identificacion`),
  ADD KEY `persona_cargo_idx` (`Cargo`);

--
-- Indices de la tabla `produccion`
--
ALTER TABLE `produccion`
  ADD PRIMARY KEY (`Id_produccion`),
  ADD KEY `Fabrica` (`fk_codigo_pdto`);

--
-- Indices de la tabla `productos`
--
ALTER TABLE `productos`
  ADD PRIMARY KEY (`Codigo_pdto`),
  ADD KEY `Genera` (`fk_codigo_up`);

--
-- Indices de la tabla `punto_venta`
--
ALTER TABLE `punto_venta`
  ADD PRIMARY KEY (`Id_punto_vent`),
  ADD KEY `encargado` (`fk_persona`);

--
-- Indices de la tabla `unidades_productivas`
--
ALTER TABLE `unidades_productivas`
  ADD PRIMARY KEY (`codigo_up`),
  ADD KEY `Asignar` (`fk_persona`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `bodega`
--
ALTER TABLE `bodega`
  MODIFY `id_bodega` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `cargo`
--
ALTER TABLE `cargo`
  MODIFY `idcargo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `compra`
--
ALTER TABLE `compra`
  MODIFY `Id_compra` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `inventario`
--
ALTER TABLE `inventario`
  MODIFY `id_inventario` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `produccion`
--
ALTER TABLE `produccion`
  MODIFY `Id_produccion` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `punto_venta`
--
ALTER TABLE `punto_venta`
  MODIFY `Id_punto_vent` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `bodega`
--
ALTER TABLE `bodega`
  ADD CONSTRAINT `bodega_inventario` FOREIGN KEY (`fk_inventario`) REFERENCES `inventario` (`id_inventario`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `bodega_produccion` FOREIGN KEY (`fk_produccion`) REFERENCES `produccion` (`Id_produccion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `compra`
--
ALTER TABLE `compra`
  ADD CONSTRAINT `compra_ibfk_1` FOREIGN KEY (`fk_persona`) REFERENCES `personas` (`identificacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `detalle`
--
ALTER TABLE `detalle`
  ADD CONSTRAINT `tiene_1` FOREIGN KEY (`fk_Id_compra`) REFERENCES `compra` (`Id_compra`),
  ADD CONSTRAINT `tiene_2` FOREIGN KEY (`fk_id_inventario`) REFERENCES `inventario` (`id_inventario`);

--
-- Filtros para la tabla `inventario`
--
ALTER TABLE `inventario`
  ADD CONSTRAINT `tiene_3` FOREIGN KEY (`fk_id_punto_vent`) REFERENCES `punto_venta` (`Id_punto_vent`),
  ADD CONSTRAINT `tiene_4` FOREIGN KEY (`fk_codigo_pdto`) REFERENCES `productos` (`Codigo_pdto`);

--
-- Filtros para la tabla `percios`
--
ALTER TABLE `percios`
  ADD CONSTRAINT `precio_cargo` FOREIGN KEY (`fk_cargo`) REFERENCES `cargo` (`idcargo`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `precio_prodcuto` FOREIGN KEY (`fk_producto`) REFERENCES `productos` (`Codigo_pdto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `personas`
--
ALTER TABLE `personas`
  ADD CONSTRAINT `persona_cargo` FOREIGN KEY (`Cargo`) REFERENCES `cargo` (`idcargo`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `produccion`
--
ALTER TABLE `produccion`
  ADD CONSTRAINT `produccion_ibfk_1` FOREIGN KEY (`fk_codigo_pdto`) REFERENCES `productos` (`Codigo_pdto`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `productos`
--
ALTER TABLE `productos`
  ADD CONSTRAINT `productos_ibfk_1` FOREIGN KEY (`fk_codigo_up`) REFERENCES `unidades_productivas` (`codigo_up`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `punto_venta`
--
ALTER TABLE `punto_venta`
  ADD CONSTRAINT `punto_venta_ibfk_1` FOREIGN KEY (`fk_persona`) REFERENCES `personas` (`identificacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Filtros para la tabla `unidades_productivas`
--
ALTER TABLE `unidades_productivas`
  ADD CONSTRAINT `unidades_productivas_ibfk_1` FOREIGN KEY (`fk_persona`) REFERENCES `personas` (`identificacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
