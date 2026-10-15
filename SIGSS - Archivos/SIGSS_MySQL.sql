-- SIGSS - Esquema MySQL / InnoDB generado a partir del XML del diagrama
CREATE DATABASE IF NOT EXISTS SIGSS;
USE SIGSS;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS=0;

CREATE TABLE `Unidades` (
  `Id_Unidad` INTEGER NOT NULL AUTO_INCREMENT,
  `Area` INTEGER NOT NULL,
  `Municipio` VARCHAR(25) NOT NULL,
  `CLUES` VARCHAR(30) NOT NULL,
  `Nombre` VARCHAR(90) NOT NULL,
  PRIMARY KEY (`Id_Unidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Roles` (
  `Id_Rol` INTEGER NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(30) NOT NULL,
  `Descripcion` TEXT NOT NULL,
  PRIMARY KEY (`Id_Rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Cat_Discapacidades` (
  `Id_Discapacidad` INTEGER NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(30) NOT NULL,
  `Clave` INTEGER NOT NULL,
  `Inciso` CHAR(1) NOT NULL,
  PRIMARY KEY (`Id_Discapacidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Pacientes` (
  `Id_Paciente` INTEGER NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(30) NOT NULL,
  `Apellido_Paterno` VARCHAR(30) NOT NULL,
  `Apellido_Materno` VARCHAR(30) NOT NULL,
  `Fecha_Nacimiento` DATE NOT NULL,
  `Entidad_Nacimiento` VARCHAR(30) NOT NULL,
  `Pais_Nacimiento` VARCHAR(30) NULL,
  `Curp` VARCHAR(18) NOT NULL,
  `Sexo` VARCHAR(10) NOT NULL,
  `Es_Afromexicano` BOOL NULL,
  `Es_Indigena` BOOL NULL,
  `Es_Migrante` BOOL NULL,
  PRIMARY KEY (`Id_Paciente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Cat_Derechohabiencia` (
  `Id_Cat_Derechohabiencia` INTEGER NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(50) NOT NULL,
  `Clave` INTEGER NOT NULL,
  PRIMARY KEY (`Id_Cat_Derechohabiencia`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Cat_Servicio` (
  `Id_Cat_Servicio` INTEGER NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(80) NOT NULL,
  `Clave` INTEGER NOT NULL,
  PRIMARY KEY (`Id_Cat_Servicio`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Cat_Referido_Motivo` (
  `Id_Cat_Referido_Motivo` INTEGER NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(50) NOT NULL,
  `Clave` INTEGER NOT NULL,
  PRIMARY KEY (`Id_Cat_Referido_Motivo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Cat_Referido_Nivel` (
  `Id_Cat_Referido_Nivel` INTEGER NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(80) NOT NULL,
  `Clave` INTEGER NOT NULL,
  PRIMARY KEY (`Id_Cat_Referido_Nivel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Cat_Intervenciones_Gerontologicas` (
  `Id_Cat_Intervenciones_Gerontologicas` INTEGER NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(100) NOT NULL,
  `Clave` INTEGER NOT NULL,
  PRIMARY KEY (`Id_Cat_Intervenciones_Gerontologicas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Cat_Diagnosticos` (
  `Id_Cat_Diagnosticos` INTEGER NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(250) NOT NULL,
  `Clave` VARCHAR(10) NOT NULL,
  PRIMARY KEY (`Id_Cat_Diagnosticos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Cat_Medicina_Tradicional` (
  `Id_Cat_Medicina_Tradicional` INTEGER NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(30) NOT NULL,
  `Clave` VARCHAR(5) NOT NULL,
  PRIMARY KEY (`Id_Cat_Medicina_Tradicional`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Salud_Nino_Adolescente` (
  `Id_Salud_Nino_Adolescente` INTEGER NOT NULL AUTO_INCREMENT,
  `RT_Nino_Sano` INTEGER NULL,
  `Tipo` INTEGER NULL,
  `Resultado` INTEGER NULL,
  `Resultado_Batelle` INTEGER NULL,
  `RT_EDA` INTEGER NULL,
  `Plan_Tratamiento` INTEGER NULL,
  `Recuperado_Deshidratacion` BOOL NULL,
  `Sobres_VSO` INTEGER NULL,
  `RT_IRA` INTEGER NULL,
  `Tipo_Tratamiento` INTEGER NULL,
  `RT_Neumonia` INTEGER NULL,
  `Aplicacion_Cedula_Cancer` INTEGER NULL,
  `Madre_INF_PA` VARCHAR(20) NULL,
  PRIMARY KEY (`Id_Salud_Nino_Adolescente`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Cat_Tipo_Personal` (
  `Id_Tipo_Personal` INTEGER NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(70) NOT NULL,
  `Clave` INTEGER NOT NULL,
  PRIMARY KEY (`Id_Tipo_Personal`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Cat_Riesgos` (
  `Id_Cat_Riesgos` INTEGER NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(50) NOT NULL,
  `Clave` INTEGER NOT NULL,
  PRIMARY KEY (`Id_Cat_Riesgos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Cat_Teleconsulta_Interpretacion` (
  `Id_Cat_Teleconsulta_Interpretacion` INTEGER NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(50) NOT NULL,
  `Clave` INTEGER NOT NULL,
  `Inciso` CHAR(1) NOT NULL,
  PRIMARY KEY (`Id_Cat_Teleconsulta_Interpretacion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Cat_Complicaciones` (
  `Id_Cat_Complicaciones` INTEGER NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(40) NOT NULL,
  `Clave` INTEGER NOT NULL,
  PRIMARY KEY (`Id_Cat_Complicaciones`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Atencion_Preventiva` (
  `Id_Atencion_Preventiva` INTEGER NOT NULL AUTO_INCREMENT,
  `Deteccion_Placa_Bacteriana` BOOL NULL,
  `Instruccion_Tecnica_Cepillado` BOOL NULL,
  `Instruccion_Uso_Hilo` BOOL NULL,
  `Aplicacion_Fluor` BOOL NULL,
  `Limpieza_Dental` BOOL NULL,
  `Raspado_Aislado_Periodontal` BOOL NULL,
  `Rev_Instruccion_Higiene_Protesis` BOOL NULL,
  `Rev_Tejidos_Bucales` BOOL NULL,
  `Instruccion_Autoexamen` BOOL NULL,
  `Sellado_Fosetas_Fisuras` INTEGER NULL,
  PRIMARY KEY (`Id_Atencion_Preventiva`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Atencion_Curativa` (
  `Id_Atencion_Curativa` INTEGER NOT NULL AUTO_INCREMENT,
  `Amalgama` INTEGER NULL,
  `Resinas` INTEGER NULL,
  `Ionomero_Vidrio` INTEGER NULL,
  `Alcasite` INTEGER NULL,
  `Material_Temporal` INTEGER NULL,
  `Diente_Temporal` INTEGER NULL,
  `Diente_Permanente` INTEGER NULL,
  `Terapia_Pulpar` INTEGER NULL,
  `Cirugia_Bucal` BOOL NULL,
  `Farmacoterapia` BOOL NULL,
  `Otras_Atenciones` INTEGER NULL,
  PRIMARY KEY (`Id_Atencion_Curativa`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Cat_Implante_Subdermico` (
  `Id_Cat_Implante_Subdermico` INTEGER NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(50) NOT NULL,
  `Clave` INTEGER NOT NULL,
  `Inciso` CHAR(1) NOT NULL,
  PRIMARY KEY (`Id_Cat_Implante_Subdermico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Orientacion_Consejeria` (
  `Id_Orientacion_Consejeria` INTEGER NOT NULL AUTO_INCREMENT,
  `Planificacion_Familiar` BOOL NULL,
  `Prevencion_ITS` BOOL NULL,
  `Prevencion_Embarazo` BOOL NULL,
  `Otras_Atenciones_SSRA` BOOL NULL,
  PRIMARY KEY (`Id_Orientacion_Consejeria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Detecciones_Revaloraciones` (
  `Id_Detecciones_Revaloraciones` INTEGER NOT NULL AUTO_INCREMENT,
  `Ha_Olvidado` BOOL NULL,
  `Alteracion_Memoria` BOOL NULL,
  `Demencia` INTEGER NULL,
  `Fuga_Orina` BOOL NULL,
  `Incontinencia_Urinaria` BOOL NULL,
  `Tiene_Caidas` BOOL NULL,
  `Sindrome_Caidas` BOOL NULL,
  `Estabilidad_Marcha` BOOL NULL,
  `Estado_Nutricion` BOOL NULL,
  `Actividades_Basicas` BOOL NULL,
  `Evaluacion_ABVD` BOOL NULL,
  `Actividades_Instrumentales` BOOL NULL,
  `Evaluacion_AIVD` BOOL NULL,
  `Grupo_Edad` INTEGER NULL,
  `Sexo` INTEGER NULL,
  `Resultado` BOOL NULL,
  PRIMARY KEY (`Id_Detecciones_Revaloraciones`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Enfermedades_Cardiometabolicas` (
  `Id_Enfermedades_Cardiometabolicas` INTEGER NOT NULL AUTO_INCREMENT,
  `Diabetes_Mellitus` BOOL NULL,
  `Hipertension_Arterial_Sistemica` BOOL NULL,
  `Obesidad` BOOL NULL,
  `Dislipidemias` BOOL NULL,
  `Enfermedad_Renal_Cronica` BOOL NULL,
  PRIMARY KEY (`Id_Enfermedades_Cardiometabolicas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Consumo_Sustancias_Psicoactivas` (
  `Id_Consumo_Sustancias_Psicoactivas` INTEGER NOT NULL AUTO_INCREMENT,
  `Alcohol` BOOL NULL,
  `Tabaco` BOOL NULL,
  `Cannabis` BOOL NULL,
  `Cocaina` BOOL NULL,
  `Metanfetaminas` BOOL NULL,
  `Inhalables` BOOL NULL,
  `Opiaceos` BOOL NULL,
  `Alucinogenos` BOOL NULL,
  `Tranquilizantes` BOOL NULL,
  `Otras_Sustancias` BOOL NULL,
  PRIMARY KEY (`Id_Consumo_Sustancias_Psicoactivas`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Cat_Grupos_Its` (
  `Id_Cat_Grupos_Its` INTEGER NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(70) NOT NULL,
  `Clave` INTEGER NOT NULL,
  PRIMARY KEY (`Id_Cat_Grupos_Its`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Cat_Resultados_ITS` (
  `Id_Cat_Resultados_ITS` INTEGER NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(90) NOT NULL,
  `Clave` INTEGER NOT NULL,
  PRIMARY KEY (`Id_Cat_Resultados_ITS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Cat_Espirometria_Resultados` (
  `Id_Cat_Espirometria_Resultados` INTEGER NOT NULL AUTO_INCREMENT,
  `Nombre` VARCHAR(60) NOT NULL,
  `Clave` INTEGER NOT NULL,
  PRIMARY KEY (`Id_Cat_Espirometria_Resultados`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Usuarios` (
  `Id_Usuario` INTEGER NOT NULL AUTO_INCREMENT,
  `Unidades_Id_Unidad` INTEGER NOT NULL,
  `Roles_Id_Rol` INTEGER NOT NULL,
  `Nombre` VARCHAR(30) NOT NULL,
  `Apellido_Paterno` VARCHAR(30) NOT NULL,
  `Apellido_Materno` VARCHAR(30) NOT NULL,
  `Nombre_Usuario` VARCHAR(20) NOT NULL,
  `Contrasena` VARCHAR(255) NOT NULL,
  `Activo` BOOL NOT NULL DEFAULT FALSE,
  `Ultimo_Acceso` DATETIME NULL,
  PRIMARY KEY (`Id_Usuario`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Prestadores` (
  `Id_Prestador` INTEGER NOT NULL AUTO_INCREMENT,
  `Cat_Tipo_Personal_Id_Tipo_Personal` INTEGER NOT NULL,
  `Unidades_Id_Unidad` INTEGER NOT NULL,
  `Curp` VARCHAR(18) NOT NULL,
  `Nombre` VARCHAR(30) NOT NULL,
  `Apellido_Paterno` VARCHAR(30) NOT NULL,
  `Apellido_Materno` VARCHAR(30) NOT NULL,
  `Cedula_Profesional` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`Id_Prestador`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Salud_Reproductiva` (
  `Id_Salud_Reproductiva` INTEGER NOT NULL AUTO_INCREMENT,
  `Cat_Complicaciones_Id_Cat_Complicaciones` INTEGER NOT NULL,
  `Cat_Riesgos_Id_Cat_Riesgos` INTEGER NOT NULL,
  `RT_Pregestacional` INTEGER NULL,
  `RT_Embarazo` INTEGER NULL,
  `Plan_Seguridad` INTEGER NULL,
  `Trimestre_Gestacional` INTEGER NULL,
  `Alto_Riesgo_Primera_Vez` BOOL NULL,
  `Otras_Acciones` INTEGER NULL,
  `RT_Puerperio` INTEGER NULL,
  `RT_Infeccion_Puerperial` INTEGER NULL,
  `Terapia_Hormonal` BOOL NULL,
  PRIMARY KEY (`Id_Salud_Reproductiva`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ITS` (
  `Id_ITS` INTEGER NOT NULL AUTO_INCREMENT,
  `Cat_Resultados_ITS_Id_Cat_Resultados_VPH` INTEGER NOT NULL,
  `Cat_Resultados_ITS_Id_Cat_Resultados_Chlamydia` INTEGER NOT NULL,
  `Cat_Resultados_ITS_Id_Cat_Resultados_Herpes_Genital` INTEGER NOT NULL,
  `Cat_Resultados_ITS_Id_Cat_Resultados_HepatitisB` INTEGER NOT NULL,
  `Cat_Resultados_ITS_Id_Cat_Resultados_Gonorrea` INTEGER NOT NULL,
  `Cat_Resultados_ITS_Id_Cat_Resultados_B24X` INTEGER NOT NULL,
  `Cat_Resultados_ITS_Id_Cat_Resultados_A539` INTEGER NOT NULL,
  `Cat_Grupos_Its_Id_Cat_Grupos_Its` INTEGER NOT NULL,
  `Tipo_Prueba` INTEGER NULL,
  PRIMARY KEY (`Id_ITS`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Bitacora` (
  `Id_Bitacora` INTEGER NOT NULL AUTO_INCREMENT,
  `Usuarios_Id_Usuario` INTEGER NOT NULL,
  `Fecha_Hora` DATETIME NOT NULL,
  `Modulo` VARCHAR(20) NOT NULL,
  `Accion` VARCHAR(40) NOT NULL,
  `Tabla_Afectada` VARCHAR(25) NOT NULL,
  PRIMARY KEY (`Id_Bitacora`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Consultas` (
  `Id_Consulta` INTEGER NOT NULL AUTO_INCREMENT,
  `Cat_I_G_Id_Cat_Intervenciones_Gerontologicas` INTEGER NULL,
  `Cat_Servicio_Id_Cat_Especialidad` INTEGER NULL,
  `Cat_Referido_Nivel_Id_Cat_Referido_Nivel` INTEGER NULL,
  `Cat_Referido_Motivo_Id_Cat_Referido_Motivo` INTEGER NULL,
  `Cat_Derechohabiencia_Id_Cat_Derechohabiencia` INTEGER NULL,
  `Prestadores_Id_Prestador` INTEGER NOT NULL,
  `Unidades_Id_Unidad` INTEGER NOT NULL,
  `Pacientes_Id_Paciente` INTEGER NOT NULL,
  `Cat_Servicio_Id_Cat_Servicio` INTEGER NOT NULL,
  `Edad` INTEGER NULL,
  `Clave_Edad` CHAR(1) NULL,
  `Folio_Receta` VARCHAR(15) NULL,
  `Expediente` VARCHAR(15) NULL,
  `Primera_Vez_Uneme` BOOL NULL,
  `Primera_Vez_Anio_Cobertura` BOOL NULL,
  `Contrarreferido` VARCHAR(10) NULL,
  `Intervencion_Salud_Mental` INTEGER NULL,
  `Primera_Vez` INTEGER NULL,
  `Subsecuente` INTEGER NULL,
  `Confirmacion_Diagnostica` INTEGER NULL,
  `RT_Por_Motivo` INTEGER NULL,
  `Fecha_Proxima_Cita` DATETIME NULL,
  `Fecha_Consulta` DATETIME NULL,
  PRIMARY KEY (`Id_Consulta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Mediciones` (
  `Id_Medicion` INTEGER NOT NULL AUTO_INCREMENT,
  `Consultas_Id_Consulta` INTEGER NOT NULL,
  `Peso` VARCHAR(10) NULL,
  `Talla` VARCHAR(10) NULL,
  `Circunferencia_Cintura` VARCHAR(10) NULL,
  `Presion_Sistolica` VARCHAR(10) NULL,
  `Presion_Diastolica` VARCHAR(10) NULL,
  `Frecuencia_Cardiaca` VARCHAR(10) NULL,
  `Frecuencia_Respiratoria` VARCHAR(10) NULL,
  `Temperatura` VARCHAR(10) NULL,
  `Saturacion_Oxigeno` VARCHAR(10) NULL,
  `Resultado_Glucosa` VARCHAR(15) NULL,
  `Glucosa_Ayuno` VARCHAR(10) NULL,
  `Numero_Tiras` INTEGER NULL,
  `Probable_Tb` VARCHAR(20) NULL,
  PRIMARY KEY (`Id_Medicion`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Consulta_Discapacidades` (
  `Cat_Discapacidades_Id_Discapacidad` INTEGER NOT NULL,
  `Consultas_Id_Consulta` INTEGER NOT NULL,
  PRIMARY KEY (`Consultas_Id_Consulta`, `Cat_Discapacidades_Id_Discapacidad`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Consulta_Diagnosticos` (
  `Consultas_Id_Consulta` INTEGER NOT NULL,
  `Cat_Diagnosticos_Id_Cat_Diagnosticos` INTEGER NOT NULL,
  PRIMARY KEY (`Consultas_Id_Consulta`, `Cat_Diagnosticos_Id_Cat_Diagnosticos`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Consulta_Medicina_Tradicional` (
  `Cat_Medicina_Tradicional_Id_Cat_Medicina_Tradicional` INTEGER NOT NULL,
  `Consultas_Id_Consulta` INTEGER NOT NULL,
  PRIMARY KEY (`Consultas_Id_Consulta`, `Cat_Medicina_Tradicional_Id_Cat_Medicina_Tradicional`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Promocion_Salud` (
  `Id_Promocion_Salud` INTEGER NOT NULL AUTO_INCREMENT,
  `Consultas_Id_Consulta` INTEGER NOT NULL,
  `Consulta_Integrada_Linea_Vida` VARCHAR(10) NULL,
  `Presenta_Cartilla` BOOL NULL,
  `Esquema_Vacunacion` INTEGER NULL,
  `Promocion_Albendazol` VARCHAR(10) NULL,
  `Sobres_VSO` INTEGER NULL,
  PRIMARY KEY (`Id_Promocion_Salud`),
  UNIQUE KEY `UQ_Promocion_Salud_Consultas_Id_Consulta` (`Consultas_Id_Consulta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Teleconsultas` (
  `Id_Teleconsulta` INTEGER NOT NULL AUTO_INCREMENT,
  `Consultas_Id_Consulta` INTEGER NOT NULL,
  `Unidad_Consultante` BOOL NULL,
  `Modalidad` INTEGER NULL,
  PRIMARY KEY (`Id_Teleconsulta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Consulta_Externa` (
  `Id_Consulta_Externa` INTEGER NOT NULL AUTO_INCREMENT,
  `Salud_Reproductiva_Id_Salud_Reproductiva` INTEGER NULL,
  `Salud_Nino_Adolescente_Id_Salud_Nino_Adolescente` INTEGER NULL,
  `Consultas_Id_Consulta` INTEGER NOT NULL,
  PRIMARY KEY (`Id_Consulta_Externa`),
  UNIQUE KEY `UQ_Consulta_Externa_Consultas_Id_Consulta` (`Consultas_Id_Consulta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Consulta_Planificacion_Familiar` (
  `Id_Consulta_Planificacion_Familiar` INTEGER NOT NULL AUTO_INCREMENT,
  `Orientacion_Consejeria_Id_Orientacion_Consejeria` INTEGER NULL,
  `Consultas_Id_Consulta` INTEGER NOT NULL,
  `Puerpera_Aceptante` BOOL NULL,
  `Oral` INTEGER NULL,
  `Inyectable_Mensual` INTEGER NULL,
  `Inyectable_Bimestral` INTEGER NULL,
  `Inyectable_Trimestral` INTEGER NULL,
  `Parche_Dermico` INTEGER NULL,
  `DIU` INTEGER NULL,
  `DIU_Medicado` INTEGER NULL,
  `Quirurgico` INTEGER NULL,
  `Preservativo` INTEGER NULL,
  `Preservativo_Femenino` INTEGER NULL,
  `Otro_Metodo` INTEGER NULL,
  `Anticoncepcion_Emergencia` BOOL NULL,
  `Vasectomia_Sin_Bisturi` BOOL NULL,
  PRIMARY KEY (`Id_Consulta_Planificacion_Familiar`),
  UNIQUE KEY `UQ_Consulta_Planificacion_Familiar_Consultas_Id_Consulta` (`Consultas_Id_Consulta`),
  UNIQUE KEY `UQ_Consulta_P_F_O_C_Id_Orientacion_Consejeria` (`Orientacion_Consejeria_Id_Orientacion_Consejeria`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Consulta_Salud_Bucal` (
  `Id_Consulta_Salud_Bucal` INTEGER NOT NULL AUTO_INCREMENT,
  `Consultas_Id_Consulta` INTEGER NOT NULL,
  `Atencion_Curativa_Id_Atencion_Curativa` INTEGER NULL,
  `Atencion_Preventiva_Id_Atencion_Preventiva` INTEGER NULL,
  `Radiografias` INTEGER NULL,
  `Tratamiento_Integral_Terminado` BOOL NULL,
  `Orientacion_Salud` BOOL NULL,
  PRIMARY KEY (`Id_Consulta_Salud_Bucal`),
  UNIQUE KEY `UQ_Consulta_Salud_Bucal_Consultas_Id_Consulta` (`Consultas_Id_Consulta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Consulta_Detecciones` (
  `Id_Consulta_Detecciones` INTEGER NOT NULL AUTO_INCREMENT,
  `Cat_Espirometria_Resultados_Id_Cat_Espirometria_Resultados` INTEGER NULL,
  `ITS_Id_ITS` INTEGER NULL,
  `Consumo_S_P_Id_Consumo_Sustancias_Psicoactivas` INTEGER NULL,
  `Enfermedades_Cardiometabolicas_Id_Enfermedades_Cardiometabolicas` INTEGER NULL,
  `Detecciones_Revaloraciones_Id_Detecciones_Revaloraciones` INTEGER NULL,
  `Consultas_Id_Consulta` INTEGER NOT NULL,
  `Tiras_Utilizadas` INTEGER NULL,
  `Prueba_Rapida_HCG` BOOL NULL,
  `Frecuentemente_Triste` BOOL NULL,
  `Depresion` BOOL NULL,
  `Ansiedad` BOOL NULL,
  `Riesgo_Fracturas_Osteoporosis` INTEGER NULL,
  `Exploracion_Cancer_Mama` INTEGER NULL,
  `Violencia_Sexual` BOOL NULL,
  `Violencia_Mujeres_15_Anos` BOOL NULL,
  `Sindrome_Turner` BOOL NULL,
  `Hiperplasia_Prostatica` BOOL NULL,
  `Reactivos_Antigeno_Prostatico` INTEGER NULL,
  `Probable_TB_Estudio` BOOL NULL,
  `Cancer_Cervicouterino_Realizado` BOOL NULL,
  `Cancer_Cervicouterino_Resultado` BOOL NULL,
  `Espirometria_VEF1` INTEGER NULL,
  `Espirometria_CVF` INTEGER NULL,
  `Espirometria_LIN` INTEGER NULL,
  PRIMARY KEY (`Id_Consulta_Detecciones`),
  UNIQUE KEY `UQ_Consulta_Detecciones_Consultas_Id_Consulta` (`Consultas_Id_Consulta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Teleconsultas_Interpretacion` (
  `Cat_T_I_Id_Cat_Teleconsulta_Interpretacion` INTEGER NOT NULL,
  `Teleconsultas_Id_Teleconsulta` INTEGER NOT NULL,
  PRIMARY KEY (
    `Cat_T_I_Id_Cat_Teleconsulta_Interpretacion`,
    `Teleconsultas_Id_Teleconsulta`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `Consultas_Planificacion_Implante` (
  `Consulta_P_F_Id_Consulta_Planificacion_Familiar` INTEGER NOT NULL,
  `Cat_Implante_Subdermico_Id_Cat_Implante_Subdermico` INTEGER NOT NULL,
  PRIMARY KEY (`Consulta_P_F_Id_Consulta_Planificacion_Familiar`, `Cat_Implante_Subdermico_Id_Cat_Implante_Subdermico`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

ALTER TABLE `Bitacora` ADD CONSTRAINT `FK_Bitacora_Usuarios_Id_Usuario` FOREIGN KEY (`Usuarios_Id_Usuario`) REFERENCES `Usuarios` (`Id_Usuario`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Usuarios` ADD CONSTRAINT `FK_Usuarios_Roles_Id_Rol` FOREIGN KEY (`Roles_Id_Rol`) REFERENCES `Roles` (`Id_Rol`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Usuarios` ADD CONSTRAINT `FK_Usuarios_Unidades_Id_Unidad` FOREIGN KEY (`Unidades_Id_Unidad`) REFERENCES `Unidades` (`Id_Unidad`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Prestadores` ADD CONSTRAINT `FK_Prestadores_Unidades_Id_Unidad` FOREIGN KEY (`Unidades_Id_Unidad`) REFERENCES `Unidades` (`Id_Unidad`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consultas` ADD CONSTRAINT `FK_Consultas_Cat_Servicio_Id_Cat_Servicio` FOREIGN KEY (`Cat_Servicio_Id_Cat_Servicio`) REFERENCES `Cat_Servicio` (`Id_Cat_Servicio`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consultas` ADD CONSTRAINT `FK_Consultas_Pacientes_Id_Paciente` FOREIGN KEY (`Pacientes_Id_Paciente`) REFERENCES `Pacientes` (`Id_Paciente`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consultas` ADD CONSTRAINT `FK_Consultas_Unidades_Id_Unidad` FOREIGN KEY (`Unidades_Id_Unidad`) REFERENCES `Unidades` (`Id_Unidad`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consultas` ADD CONSTRAINT `FK_Consultas_Prestadores_Id_Prestador` FOREIGN KEY (`Prestadores_Id_Prestador`) REFERENCES `Prestadores` (`Id_Prestador`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consultas` ADD CONSTRAINT `FK_Consultas_Cat_Derechohabiencia_Id_Cat_Derechohabiencia` FOREIGN KEY (`Cat_Derechohabiencia_Id_Cat_Derechohabiencia`) REFERENCES `Cat_Derechohabiencia` (`Id_Cat_Derechohabiencia`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consultas` ADD CONSTRAINT `FK_Consultas_Cat_Referido_Motivo_Id_Cat_Referido_Motivo` FOREIGN KEY (`Cat_Referido_Motivo_Id_Cat_Referido_Motivo`) REFERENCES `Cat_Referido_Motivo` (`Id_Cat_Referido_Motivo`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consultas` ADD CONSTRAINT `FK_Consultas_Cat_Referido_Nivel_Id_Cat_Referido_Nivel` FOREIGN KEY (`Cat_Referido_Nivel_Id_Cat_Referido_Nivel`) REFERENCES `Cat_Referido_Nivel` (`Id_Cat_Referido_Nivel`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consultas` ADD CONSTRAINT `FK_Consultas_Cat_Servicio_Id_Cat_Especialidad` FOREIGN KEY (`Cat_Servicio_Id_Cat_Especialidad`) REFERENCES `Cat_Servicio` (`Id_Cat_Servicio`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Mediciones` ADD CONSTRAINT `FK_Mediciones_Consultas_Id_Consulta` FOREIGN KEY (`Consultas_Id_Consulta`) REFERENCES `Consultas` (`Id_Consulta`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consultas` ADD CONSTRAINT `FK_Consultas_Cat_I_G_Id_Cat_Intervenciones_Gerontologicas` FOREIGN KEY (`Cat_I_G_Id_Cat_Intervenciones_Gerontologicas`) REFERENCES `Cat_Intervenciones_Gerontologicas` (`Id_Cat_Intervenciones_Gerontologicas`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Discapacidades` ADD CONSTRAINT `FK_Consulta_Discapacidades_Consultas_Id_Consulta` FOREIGN KEY (`Consultas_Id_Consulta`) REFERENCES `Consultas` (`Id_Consulta`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Discapacidades` ADD CONSTRAINT `FK_Consulta_Discapacidades_Cat_Discapacidades_Id_Discapacidad` FOREIGN KEY (`Cat_Discapacidades_Id_Discapacidad`) REFERENCES `Cat_Discapacidades` (`Id_Discapacidad`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Diagnosticos` ADD CONSTRAINT `FK_Consulta_Diagnosticos_Cat_Diagnosticos_Id_Cat_Diagnosticos` FOREIGN KEY (`Cat_Diagnosticos_Id_Cat_Diagnosticos`) REFERENCES `Cat_Diagnosticos` (`Id_Cat_Diagnosticos`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Diagnosticos` ADD CONSTRAINT `FK_Consulta_Diagnosticos_Consultas_Id_Consulta` FOREIGN KEY (`Consultas_Id_Consulta`) REFERENCES `Consultas` (`Id_Consulta`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Medicina_Tradicional` ADD CONSTRAINT `FK_Consulta_Medicina_Tradicional_Consultas_Id_Consulta` FOREIGN KEY (`Consultas_Id_Consulta`) REFERENCES `Consultas` (`Id_Consulta`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Medicina_Tradicional` ADD CONSTRAINT `FK_Consulta_M_T_Cat_M_Tradicional_Id_Cat_M_T` FOREIGN KEY (`Cat_Medicina_Tradicional_Id_Cat_Medicina_Tradicional`) REFERENCES `Cat_Medicina_Tradicional` (`Id_Cat_Medicina_Tradicional`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Promocion_Salud` ADD CONSTRAINT `FK_Promocion_Salud_Consultas_Id_Consulta` FOREIGN KEY (`Consultas_Id_Consulta`) REFERENCES `Consultas` (`Id_Consulta`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Teleconsultas` ADD CONSTRAINT `FK_Teleconsultas_Consultas_Id_Consulta` FOREIGN KEY (`Consultas_Id_Consulta`) REFERENCES `Consultas` (`Id_Consulta`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Prestadores` ADD CONSTRAINT `FK_Prestadores_Cat_Tipo_Personal_Id_Tipo_Personal` FOREIGN KEY (`Cat_Tipo_Personal_Id_Tipo_Personal`) REFERENCES `Cat_Tipo_Personal` (`Id_Tipo_Personal`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Salud_Reproductiva` ADD CONSTRAINT `FK_Salud_Reproductiva_Cat_Riesgos_Id_Cat_Riesgos` FOREIGN KEY (`Cat_Riesgos_Id_Cat_Riesgos`) REFERENCES `Cat_Riesgos` (`Id_Cat_Riesgos`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Teleconsultas_Interpretacion` ADD CONSTRAINT `FK_Teleconsultas_Interpretacion_Teleconsultas_Id_Teleconsulta` FOREIGN KEY (`Teleconsultas_Id_Teleconsulta`) REFERENCES `Teleconsultas` (`Id_Teleconsulta`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Teleconsultas_Interpretacion` ADD CONSTRAINT `FK_T_I_Cat_T_I_Id_Cat_Teleconsulta_I` FOREIGN KEY (`Cat_T_I_Id_Cat_Teleconsulta_Interpretacion`) REFERENCES `Cat_Teleconsulta_Interpretacion` (`Id_Cat_Teleconsulta_Interpretacion`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Salud_Reproductiva` ADD CONSTRAINT `FK_Salud_Reproductiva_Cat_Complicaciones_Id_Cat_Complicaciones` FOREIGN KEY (`Cat_Complicaciones_Id_Cat_Complicaciones`) REFERENCES `Cat_Complicaciones` (`Id_Cat_Complicaciones`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Externa` ADD CONSTRAINT `FK_Consulta_Externa_Consultas_Id_Consulta` FOREIGN KEY (`Consultas_Id_Consulta`) REFERENCES `Consultas` (`Id_Consulta`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Externa` ADD CONSTRAINT `FK_Consulta_Externa_Salud_Reproductiva_Id_Salud_Reproductiva` FOREIGN KEY (`Salud_Reproductiva_Id_Salud_Reproductiva`) REFERENCES `Salud_Reproductiva` (`Id_Salud_Reproductiva`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Externa` ADD CONSTRAINT `FK_Consulta_Externa_S_N_A_Id_Salud_Nino_Adolescente` FOREIGN KEY (`Salud_Nino_Adolescente_Id_Salud_Nino_Adolescente`) REFERENCES `Salud_Nino_Adolescente` (`Id_Salud_Nino_Adolescente`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Salud_Bucal` ADD CONSTRAINT `FK_Consulta_S_B_A_P_Id_Atencion_Preventiva` FOREIGN KEY (`Atencion_Preventiva_Id_Atencion_Preventiva`) REFERENCES `Atencion_Preventiva` (`Id_Atencion_Preventiva`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Salud_Bucal` ADD CONSTRAINT `FK_Consulta_Salud_Bucal_Atencion_Curativa_Id_Atencion_Curativa` FOREIGN KEY (`Atencion_Curativa_Id_Atencion_Curativa`) REFERENCES `Atencion_Curativa` (`Id_Atencion_Curativa`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consultas_Planificacion_Implante` ADD CONSTRAINT `FK_Consultas_P_I_Cat_I_S_Id_Cat_Implante_Subdermico` FOREIGN KEY (`Cat_Implante_Subdermico_Id_Cat_Implante_Subdermico`) REFERENCES `Cat_Implante_Subdermico` (`Id_Cat_Implante_Subdermico`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consultas_Planificacion_Implante` ADD CONSTRAINT `FK_Consultas_P_I_Consulta_P_F_Id_Consulta_P_F` FOREIGN KEY (`Consulta_P_F_Id_Consulta_Planificacion_Familiar`) REFERENCES `Consulta_Planificacion_Familiar` (`Id_Consulta_Planificacion_Familiar`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Planificacion_Familiar` ADD CONSTRAINT `FK_Consulta_P_F_O_C_Id_Orientacion_Consejeria` FOREIGN KEY (`Orientacion_Consejeria_Id_Orientacion_Consejeria`) REFERENCES `Orientacion_Consejeria` (`Id_Orientacion_Consejeria`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Planificacion_Familiar` ADD CONSTRAINT `FK_Consulta_Planificacion_Familiar_Consultas_Id_Consulta` FOREIGN KEY (`Consultas_Id_Consulta`) REFERENCES `Consultas` (`Id_Consulta`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Salud_Bucal` ADD CONSTRAINT `FK_Consulta_Salud_Bucal_Consultas_Id_Consulta` FOREIGN KEY (`Consultas_Id_Consulta`) REFERENCES `Consultas` (`Id_Consulta`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Detecciones` ADD CONSTRAINT `FK_Consulta_Detecciones_Consultas_Id_Consulta` FOREIGN KEY (`Consultas_Id_Consulta`) REFERENCES `Consultas` (`Id_Consulta`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Detecciones` ADD CONSTRAINT `FK_Consulta_Detecciones_D_R_Id_D_R` FOREIGN KEY (`Detecciones_Revaloraciones_Id_Detecciones_Revaloraciones`) REFERENCES `Detecciones_Revaloraciones` (`Id_Detecciones_Revaloraciones`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Detecciones` ADD CONSTRAINT `FK_Consulta_Detecciones_E_C_Id_E_C` FOREIGN KEY (`Enfermedades_Cardiometabolicas_Id_Enfermedades_Cardiometabolicas`) REFERENCES `Enfermedades_Cardiometabolicas` (`Id_Enfermedades_Cardiometabolicas`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Detecciones` ADD CONSTRAINT `FK_Consulta_Detecciones_C_S_P_Id_C_S_P` FOREIGN KEY (`Consumo_S_P_Id_Consumo_Sustancias_Psicoactivas`) REFERENCES `Consumo_Sustancias_Psicoactivas` (`Id_Consumo_Sustancias_Psicoactivas`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `ITS` ADD CONSTRAINT `FK_ITS_Cat_Grupos_Its_Id_Cat_Grupos_Its` FOREIGN KEY (`Cat_Grupos_Its_Id_Cat_Grupos_Its`) REFERENCES `Cat_Grupos_Its` (`Id_Cat_Grupos_Its`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `ITS` ADD CONSTRAINT `FK_ITS_Cat_Resultados_ITS_Id_Cat_Resultados_A539` FOREIGN KEY (`Cat_Resultados_ITS_Id_Cat_Resultados_A539`) REFERENCES `Cat_Resultados_ITS` (`Id_Cat_Resultados_ITS`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `ITS` ADD CONSTRAINT `FK_ITS_Cat_Resultados_ITS_Id_Cat_Resultados_B24X` FOREIGN KEY (`Cat_Resultados_ITS_Id_Cat_Resultados_B24X`) REFERENCES `Cat_Resultados_ITS` (`Id_Cat_Resultados_ITS`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `ITS` ADD CONSTRAINT `FK_ITS_Cat_Resultados_ITS_Id_Cat_Resultados_Gonorrea` FOREIGN KEY (`Cat_Resultados_ITS_Id_Cat_Resultados_Gonorrea`) REFERENCES `Cat_Resultados_ITS` (`Id_Cat_Resultados_ITS`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `ITS` ADD CONSTRAINT `FK_ITS_Cat_Resultados_ITS_Id_Cat_Resultados_HepatitisB` FOREIGN KEY (`Cat_Resultados_ITS_Id_Cat_Resultados_HepatitisB`) REFERENCES `Cat_Resultados_ITS` (`Id_Cat_Resultados_ITS`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `ITS` ADD CONSTRAINT `FK_ITS_Cat_Resultados_ITS_Id_Cat_Resultados_Herpes_Genital` FOREIGN KEY (`Cat_Resultados_ITS_Id_Cat_Resultados_Herpes_Genital`) REFERENCES `Cat_Resultados_ITS` (`Id_Cat_Resultados_ITS`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `ITS` ADD CONSTRAINT `FK_ITS_Cat_Resultados_ITS_Id_Cat_Resultados_Chlamydia` FOREIGN KEY (`Cat_Resultados_ITS_Id_Cat_Resultados_Chlamydia`) REFERENCES `Cat_Resultados_ITS` (`Id_Cat_Resultados_ITS`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `ITS` ADD CONSTRAINT `FK_ITS_Cat_Resultados_ITS_Id_Cat_Resultados_VPH` FOREIGN KEY (`Cat_Resultados_ITS_Id_Cat_Resultados_VPH`) REFERENCES `Cat_Resultados_ITS` (`Id_Cat_Resultados_ITS`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Detecciones` ADD CONSTRAINT `FK_Consulta_Detecciones_ITS_Id_ITS` FOREIGN KEY (`ITS_Id_ITS`) REFERENCES `ITS` (`Id_ITS`) ON DELETE NO ACTION ON UPDATE NO ACTION;
ALTER TABLE `Consulta_Detecciones` ADD CONSTRAINT `FK_Consulta_Detecciones_Cat_E_R_Id_Cat_E_R` FOREIGN KEY (`Cat_Espirometria_Resultados_Id_Cat_Espirometria_Resultados`) REFERENCES `Cat_Espirometria_Resultados` (`Id_Cat_Espirometria_Resultados`) ON DELETE NO ACTION ON UPDATE NO ACTION;

SET FOREIGN_KEY_CHECKS=1;

/* ============================================================
   DATOS
   ============================================================ */

INSERT INTO Cat_Discapacidades (Nombre, Clave, Inciso) VALUES
-- Inciso a) Tipo de dificultad
('VER', 1, 'a'),
('ESCUCHAR', 2, 'a'),
('CAMINAR', 3, 'a'),
('USAR BRAZOS/MANOS', 4, 'a'),
('APRENDER/RECORDAR', 5, 'a'),
('CUIDADO PERSONAL', 6, 'a'),
('HABLAR/COMUNICARSE', 7, 'a'),
('EMOCIONAL/MENTAL', 8, 'a'),
('NINGUNA', 9, 'a'),

-- Inciso b) Grado de dificultad
('POCA DIFICULTAD', 1, 'b'),
('MUCHA DIFICULTAD', 2, 'b'),
('NO PUEDE HACERLO', 3, 'b'),
('SIN DIFICULTAD', 9, 'b'),

-- Inciso c) Causa de la dificultad
('ENFERMEDAD', 1, 'c'),
('EDAD AVANZADA', 2, 'c'),
('NACIÓ ASÍ', 3, 'c'),
('ACCIDENTE', 4, 'c'),
('VIOLENCIA', 5, 'c'),
('OTRA CAUSA', 6, 'c'),
('SIN DIFICULTAD', 9, 'c');

INSERT INTO Cat_Derechohabiencia (Nombre, Clave) VALUES
('NINGUNA', 1),
('IMSS', 2),
('ISSSTE', 3),
('PEMEX', 4),
('SEDENA', 5),
('SEMAR', 6),
('SEGURO PRIVADO', 9),
('ISSFAM', 11),
('SERVICIOS DE SALUD IMSS BIENESTAR', 14),
('SEGURIDAD SOCIAL ESTATAL', 15),
('OTRA', 8),
('SE IGNORA', 99);

INSERT INTO Cat_Servicio (Nombre, Clave) VALUES
('CIRUGÍA', 3),
('CONSULTA EXTERNA GENERAL', 4),
('GINECOOBSTETRICIA', 5),
('HOMEOPATÍA', 6),
('MEDICINA INTERNA', 7),
('MEDICINA PREVENTIVA', 8),
('MEDICINA TRADICIONAL INDÍGENA', 9),
('OFTALMOLOGÍA', 13),
('OTORRINOLARINGOLOGÍA', 14),
('PEDIATRÍA', 16),
('PRECONSULTA', 18),
('SERVICIO AMIGABLE', 22),
('TRAUMATOLOGÍA Y ORTOPEDIA', 23),
('ACUPUNTURA', 24),
('ALERGOLOGÍA', 25),
('ANESTESIOLOGÍA', 26),
('ANGIOLOGÍA', 27),
('AUDIOLOGÍA, OTONEUROLOGÍA Y FONIATRÍA', 28),
('BRIGADA, ACERCAMIENTO DE SERVICIOS O CONSULTA EN CASA', 29),
('CARDIOLOGÍA', 30),
('CIRUGÍA PLÁSTICA Y RECONSTRUCTIVA', 32),
('CLÍNICA DE DOWN', 33),
('DERMATOLOGÍA', 34),
('ENDOCRINOLOGÍA', 35),
('EPIDEMIOLOGÍA', 36),
('GASTROENTEROLOGÍA', 37),
('GENÉTICA', 38),
('GERIATRÍA', 39),
('HEMATOLOGÍA', 40),
('INFECTOLOGÍA', 41),
('INMUNOLOGÍA', 42),
('MEDICINA INTEGRADA', 43),
('MEDICINA NUCLEAR E IMAGENOLOGÍA MOLECULAR', 44),
('NEFROLOGÍA', 45),
('NEONATOLOGÍA', 46),
('NEUMOLOGÍA', 47),
('NEUROCIRUGÍA', 48),
('NEUROLOGÍA', 49),
('NUTRICIÓN', 50),
('ONCOLOGÍA', 51),
('OPTOMETRÍA', 52),
('PROCTOLOGÍA', 53),
('REHABILITACIÓN', 54),
('REUMATOLOGÍA', 55),
('TRANSPLANTES', 57),
('UROLOGÍA', 59),
('CUIDADOS PALIATIVOS', 61),
('GERONTOLOGÍA', 62),
('MEDICINA FAMILIAR', 69),
('SERVICIO ESPECIALIZADO PARA LA ATENCIÓN DE VIH/ITS', 70),
('ONCOLOGÍA PEDIÁTRICA', 72),
('OTROS', 88);

INSERT INTO Cat_Referido_Motivo (Nombre, Clave) VALUES
('EMBARAZO ALTO RIESGO', 1),
('SOSPECHA CÁNCER <18 AÑOS', 2),
('IRA''s', 3),
('NEUMONÍA', 4),
('CISTICERCOSIS', 6),
('EMERGENCIA OBSTÉTRICA-PREECLAMPSIA', 7),
('EMERGENCIA OBSTÉTRICA-HEMORRAGIA', 8),
('OTRA EMERGENCIA OBSTÉTRICA', 9),
('ABORTO NO APTO PARA ATENCIÓN AMBULATORIA', 10),
('CON RIESGO DE RETRASO EN EL DESARROLLO', 11),
('OTROS', 5);

INSERT INTO Cat_Referido_Nivel (Nombre, Clave) VALUES
('PRIMER NIVEL (OTRA UNIDAD)', 1),
('UNEMES', 2),
('2DO NIVEL CE', 3),
('2DO NIVEL URGENCIAS', 4),
('2DO NIVEL AUXILIARES DE DIAGNÓSTICO', 5),
('TERCER NIVEL CE', 6),
('TERCER NIVEL AUXILIARES DE DIAGNÓSTICO', 7),
('SERVICIO SUBROGADO AUXILIARES DE DIAGNÓSTICO O PROCEDIMIENTOS', 8),
('OTRO', 88);

INSERT INTO Cat_Intervenciones_Gerontologicas (Nombre, Clave) VALUES
('SINTOMATOLOGÍA DEPRESIVA PREVENTIVA', 1),
('ALTERACIONES DE LA MEMORIA PREVENTIVA', 2),
('ACTIVIDADES INSTRUMENTALES Y ACTIVIDADES BÁSICAS DE LA VIDA DIARIA PREVENTIVA', 3),
('SÍNDROME DE CAÍDAS PREVENTIVA', 4),
('INCONTINENCIA URINARIA PREVENTIVA', 5),
('MOTRICIDAD PREVENTIVA', 6),
('ASESORÍA NUTRICIONAL PREVENTIVA', 7),
('SINTOMATOLOGÍA DEPRESIVA TRATAMIENTO', 8),
('ALTERACIONES DE LA MEMORIA TRATAMIENTO', 9),
('ACTIVIDADES INSTRUMENTALES Y ACTIVIDADES BÁSICAS DE LA VIDA DIARIA TRATAMIENTO', 10),
('SÍNDROME DE CAÍDAS TRATAMIENTO', 11),
('INCONTINENCIA URINARIA TRATAMIENTO', 12),
('MOTRICIDAD TRATAMIENTO', 13),
('ASESORÍA NUTRICIONAL TRATAMIENTO', 14);

-- Para hacer el insert de los diagnsticos, consulte el archivo Cat_Diagnosticos_CIE-10 para hacer el insert masivo

INSERT INTO Cat_Medicina_Tradicional (Nombre, Clave) VALUES
('LIMPIAS', 'MT01'),
('SOBADAS', 'MT02'),
('EMPACHO', 'MT03'),
('INFECCIÓN ESTOMACAL', 'MT04'),
('LAVATIVAS INTESTINALES', 'MT05'),
('SUSTO', 'MT06'),
('HIPERTENSIÓN', 'MT07'),
('DIABETES', 'MT08'),
('MAL DE OJO', 'MT09'),
('MAL DE AIRE', 'MT10'),
('CAÍDA DE MOLLERA', 'MT11'),
('ACOMODO DE HUESOS', 'MT12'),
('CONTRACTURAS', 'MT13'),
('ANSIEDAD', 'MT14'),
('LIMPIEZA DE OÍDOS', 'MT15'),
('MIGRAÑA', 'MT16'),
('ENFERMEDADES RESPIRATORIAS', 'MT17'),
('DOLORES MUSCULARES', 'MT18'),
('ARTRITIS', 'MT19'),
('REUMATISMO', 'MT20'),
('ALINEACIÓN DE COLUMNA', 'MT21'),
('CIERRE DE CINTURA', 'MT23'),
('TERAPIAS CON TEMAZCAL', 'MT24'),
('ANGINAS', 'MT25'),
('LEVANTAMIENTO DE SOMBRA', 'MT26'),
('MANTEO CON REBOZO', 'MT27'),
('ACOMODO DE ÓRGANOS', 'MT28'),
('BAÑOS POSTPARTO', 'MT29'),
('PROBLEMAS DE MATRIZ', 'MT30'),
('ACOMPAÑAMIENTO EN EL EMBARAZO', 'MT31'),
('MASAJES POSTPARTO', 'MT32'),
('PROBLEMAS EN LA MENOPAUSIA', 'MT33'),
('OTRO', 'MT34'),
('NERVIOS', 'MT35');

INSERT INTO Cat_Tipo_Personal (Nombre, Clave) VALUES
('MÉDICA(O) PASANTE', 1),
('MÉDICA(O) GENERAL', 2),
('MÉDICA(O) RESIDENTE', 3),
('MÉDICA(O) ESPECIALISTA', 4),
('ENFERMERA(O) SIN CÉDULA PROFESIONAL', 5),
('ENFERMERA(O) CON CÉDULA PROFESIONAL', 6),
('PASANTE DE NUTRICIÓN', 7),
('NUTRIÓLOGA(O)', 8),
('HOMEÓPATA', 9),
('MÉDICA(O) TRADICIONAL INDÍGENA', 10),
('TAPS', 11),
('PASANTE DE PSICOLOGÍA', 15),
('PSICÓLOGA(O)', 16),
('MÉDICA(O) GENERAL HABILITADA(O) PARA SALUD MENTAL', 19),
('LICENCIADA(O) EN ENFERMERÍA', 20),
('PARTERA(O) TÉCNICA(O)', 21),
('PROMOTOR(A) DE SALUD', 22),
('MÉDICA(O) ESPECIALISTA HABILITADA(O) PARA SALUD MENTAL', 24),
('LICENCIADA(O) EN GERONTOLOGÍA', 25),
('PASANTE DE GERONTOLOGÍA', 27),
('ACUPUNTURISTA', 29),
('ENFERMERA(O) ESPECIALISTA', 32),
('LICENCIADA(O) EN SALUD INTERCULTURAL', 33),
('PARTERA TRADICIONAL INDÍGENA', 34);

INSERT INTO Cat_Riesgos (Nombre, Clave) VALUES
('PATOLOGÍA CRÓNICA ÓRGANO FUNCIONAL', 1),
('PATOLOGÍA CRÓNICA INFECCIOSA', 2),
('ANTECEDENTES DE MORBILIDAD MATERNA EXTREMA', 3),
('CON FACTORES DE RIESGOS SOCIALES', 4),
('ANTECEDENTES OBSTÉTRICOS DE RIESGO', 5),
('SIN RIESGO', 9);

INSERT INTO Cat_Teleconsulta_Interpretacion (Nombre, Clave, Inciso) VALUES
-- Inciso a) Teleconsulta / Interpretación diagnóstica
('NO', 0, 'a'),
('SI', 1, 'a'),
-- Inciso b) Tipo de estudio
('USG', 1, 'b'),
('ECG', 2, 'b'),
('RAYOS X', 3, 'b'),
('TOMOGRAFÍA', 4, 'b'),
('RESONANCIA MAGNETICA', 5, 'b'),
('MASTOGRAFÍA', 6, 'b'),
('PRUEBA DE EMBARAZO CUANTITATIVA hGC', 8, 'b'),
('OTROS', 7, 'b');

INSERT INTO Cat_Complicaciones (Nombre, Clave) VALUES
('DIAGNÓSTICO DE DM', 1),
('INFECCIÓN URINARIA', 2),
('PREECLAMPSIA/ECLAMPSIA', 3),
('HEMORRAGIA', 4),
('SOSPECHA COVID-19', 5),
('COVID-19 CONFIRMADO', 6),
('HIPERTENSIÓN ARTERIAL PREEXISTENTE', 7),
('ANEMIA', 8);

INSERT INTO Cat_Implante_Subdermico (Nombre, Clave, Inciso) VALUES
-- Inciso a) UNA VARILLA
('REVISIÓN', 0, 'a'),
('INSERCIÓN/REINSERCIÓN', 1, 'a'),
-- Inciso b) DOBLE VARILLAS
('REVISIÓN', 0, 'b'),
('INSERCIÓN/REINSERCIÓN', 1, 'b');

INSERT INTO Cat_Grupos_Its (Nombre, Clave) VALUES
('HOMBRES QUE TIENE SEXO CON HOMBRES', 1),
('TRABAJADOR SEXUAL', 2),
('TRANSEXUAL', 3),
('HETEROSEXUAL', 4),
('USO DE DROGAS INYECTABLES', 5),
('PRIVADA DE LA LIBERTAD', 6),
('PERSONA VIVIENDO CON VIH EN TAR', 7),
('USO DE DROGAS NO INYECTABLES', 8);

INSERT INTO Cat_Resultados_ITS (Nombre, Clave) VALUES
('PRIMERA VEZ, PRUEBA RÁPIDA. REACTIVA', 1),
('PRIMERA VEZ, PRUEBA RÁPIDA. NO REACTIVA', 2),
('PRIMERA VEZ, LABORATORIO POSITIVA', 3),
('PRIMERA VEZ, LABORATORIO NEGATIVA', 4),
('SUBSECUENTE, PRUEBA RÁPIDA. REACTIVA', 5),
('SUBSECUENTE, PRUEBA RÁPIDA. NO REACTIVA', 6),
('SUBSECUENTE, LABORATORIO POSITIVA', 7),
('SUBSECUENTE, LABORATORIO NEGATIVA', 8),
('PRUEBA CONFIRMATORIA Y/O SUPLEMENTARIA POSITIVA', 9),
('PRUEBA CONFIRMATORIA Y/O SUPLEMENTARIA. NEGATIVA', 10);

INSERT INTO Cat_Espirometria_Resultados (Nombre, Clave) VALUES
('NORMAL CON RESPUESTA A BRONCODILATADOR', 1),
('MORMAL SIN RESPUESTA A BRONCODILATADOR', 2),
('OBSTRUIDO CON RESPUESTA A BRONCODILATADOR', 3),
('OBSTRUIDO SIN RESPUESTA A BRONCODILATADOR', 4),
('SUGIERE RESTRICCIÓN CON RESPUESTA A BRONCODILATADOR', 5),
('SUGIERE RESTRICCIÓN SIN RESPUESTA A BRONCODILATADOR', 6),
('SUGIERE PATRÓN MIXTO CON RESPUESTA A BRONCODILATADOR', 7),
('SUGIERE PATRÓN MIXTO SIN RESPUESTA A BRONCODILATADOR', 8),
('PATRÓN NO ESPECIFICO CON RESPUESTA A BRONCODILATADOR', 9),
('PATRÓN NO ESPECIFICO SIN RESPUESTA A BRONCODILATADOR', 10);

INSERT INTO `unidades` VALUES (1,1,'GÓMEZ PALACIO','DGSSA000710','RUBÉN JARAMILLO'),(2,1,'GÓMEZ PALACIO','DGSSA000722','GONZÁLEZ DE LA VEGA'),(3,1,'GÓMEZ PALACIO','DGSSA000734','INDEPENDENCIA'),(4,1,'GÓMEZ PALACIO','DGSSA000746','COLONIA LAS LUISAS'),(5,1,'GÓMEZ PALACIO','DGSSA000751','NOGALES'),(6,1,'GÓMEZ PALACIO','DGSSA000763','COLONIA JOSÉ LÓPEZ PORTILLO'),(7,1,'GÓMEZ PALACIO','DGSSA000775','COLONIA 15 DE DICIEMBRE'),(8,1,'GÓMEZ PALACIO','DGSSA000780','CESSA DR. ISAURO VENZOR (JEF. ÁREA 1)'),(9,1,'GÓMEZ PALACIO','DGSSA000792','BRITTINGHAM'),(10,1,'GÓMEZ PALACIO','DGSSA000804','EJIDO CALIFORNIA'),(11,1,'GÓMEZ PALACIO','DGSSA000816','GREGORIO GARCÍA'),(12,1,'GÓMEZ PALACIO','DGSSA000821','PASTOR ROUAIX'),(13,1,'GÓMEZ PALACIO','DGSSA000833','LA POPULAR'),(14,1,'GÓMEZ PALACIO','DGSSA000845','SAN FELIPE (EL COMPÁS)'),(15,1,'GÓMEZ PALACIO','DGSSA000850','SANTA CRUZ LUJÁN'),(16,1,'GÓMEZ PALACIO','DGSSA002262','SAN JOSÉ DEL VIÑEDO'),(17,1,'GÓMEZ PALACIO','DGSSA002332','COLONIA FELIPE ÁNGELES'),(18,1,'GÓMEZ PALACIO','DGSSA017423','UNEME CECOSAMA GÓMEZ PALACIO'),(19,1,'GÓMEZ PALACIO','DGSSA017435','UNEME SALUD MENTAL GÓMEZ PALACIO (CISAME)'),(20,1,'GÓMEZ PALACIO','DGSSA017686','UNEME CRÓNICAS GÓMEZ PALACIO'),(21,1,'GÓMEZ PALACIO','DGSSA003131','UNEME CÁNCER DE MAMA GÓMEZ PALACIO (DEDICAM)'),(22,1,'GÓMEZ PALACIO','DGSSA002414','HOSPITAL NUEVO GÓMEZ PALACIO 2° NIVEL'),(23,1,'MAPIMÍ','DGSSA001166','BERMEJILLO'),(24,1,'MAPIMÍ','DGSSA001171','CEBALLOS'),(25,1,'MAPIMÍ','DGSSA001183','JARALITO'),(26,1,'MAPIMÍ','DGSSA017295','H.I MAPIMÍ'),(27,1,'MAPIMÍ','DGSSA001154','UNIDAD MÉDICA MÓVIL T0, MAPIMÍ'),(28,1,'MAPIMÍ','DGSSA017715','UNIDAD MÉDICA MÓVIL T3 MAPIMÍ, CENTRO'),(29,1,'MAPIMÍ','DGSSA017814','UNEME ENFERMEDADES CRÓNICAS BERMEJILLO'),(30,1,'MAPIMÍ','DGSSA001796','UNIDAD MÉDICA MÓVIL SAN JUAN DE GPE 1'),(31,1,'TLAHUALILO','DGSSA002105','TLAHUALILO DE ZARAGOZA'),(32,1,'TLAHUALILO','DGSSA002110','BANCO NACIONAL'),(33,1,'TLAHUALILO','DGSSA002122','LA CAMPANA'),(34,1,'TLAHUALILO','DGSSA002134','SAN FRANCISCO DE HORIZONTE'),(35,1,'TLAHUALILO','DGSSA002146','JAUJA'),(36,1,'TLAHUALILO','DGSSA002151','LUCERO'),(37,1,'TLAHUALILO','DGSSA002164','UNIDAD MÉDICA MÓVIL T0 TLAHUALILO'),(38,1,'TLAHUALILO','DGSSA017621','GRANJA MORELOS'),(39,2,'LERDO','DGSSA001014','COLONIA CÉSAR G. MERAZ'),(40,2,'LERDO','DGSSA001026','COLONIA SAN ISIDRO'),(41,2,'LERDO','DGSSA001031','DR. ROBERTO GARCÍA SOSA (JEF. ÁREA 2)'),(42,2,'LERDO','DGSSA001043','LOS ÁNGELES'),(43,2,'LERDO','DGSSA001055','CARLOS REAL'),(44,2,'LERDO','DGSSA001060','LEÓN GUZMÁN'),(45,2,'LERDO','DGSSA001072','JUAN E. GARCÍA'),(46,2,'LERDO','DGSSA001084','LA LOMA'),(47,2,'LERDO','DGSSA001096','LA LUZ'),(48,2,'LERDO','DGSSA001101','NAZARENO'),(49,2,'LERDO','DGSSA001113','NUEVO GRACEROS'),(50,2,'LERDO','DGSSA001125','21 DE MARZO'),(51,2,'LERDO','DGSSA001130','CD. JUÁREZ, DGO'),(52,2,'LERDO','DGSSA002320','CENTRO DE SALUD SAPIORIZ'),(53,2,'LERDO','DGSSA003173','CENTRO DE SALUD RURAL SAN JACINTO'),(54,2,'LERDO','DGSSA003140','UNEME ENFERMEDADES CRÓNICAS LERDO'),(55,2,'LERDO','DGSSA017761','HOSPITAL GENERAL LERDO 2° NIVEL'),(56,2,'SIMÓN BOLÍVAR','DGSSA000664','IGNACIO ZARAGOZA'),(57,3,'NAZAS','DGSSA017826','H.I NAZAS (JEF. ÁREA 3)'),(58,3,'NAZAS','DGSSA001352','PASO NACIONAL'),(59,3,'NAZAS','DGSSA001364','LA PERLA'),(60,3,'NAZAS','DGSSA001376','LÁZARO CÁRDENAS'),(61,3,'NAZAS','DGSSA001340','DOLORES HIDALGO'),(62,3,'SAN LUIS DEL CORDERO','DGSSA001854','SAN LUIS DEL CORDERO'),(63,3,'SAN PEDRO DEL GALLO','DGSSA001866','SAN PEDRO DEL GALLO'),(64,3,'SAN PEDRO DEL GALLO','DGSSA001871','SANTO DOMINGO'),(65,4,'CUÉNCAMÉ','DGSSA000121','CUÉNCAMÉ (JEF. ÁREA 4)'),(66,4,'CUÉNCAMÉ','DGSSA000133','IGNACIO LÓPEZ RAYÓN'),(67,4,'CUÉNCAMÉ','DGSSA000145','PEDRO VÉLEZ'),(68,4,'CUÉNCAMÉ','DGSSA000150','RAMÓN CORONA'),(69,4,'CUÉNCAMÉ','DGSSA000162','LA ROCA'),(70,4,'CUÉNCAMÉ','DGSSA000174','LA VIRGEN'),(71,4,'CUÉNCAMÉ','DGSSA000116','HOSPITAL REGIONAL DE CUÉNCAMÉ 2° NIVEL'),(72,4,'PEÑÓN BLANCO','DGSSA001545','H.I PEÑÓN BLANCO'),(73,4,'SANTA CLARA','DGSSA001883','SANTA CLARA'),(74,4,'SIMÓN BOLÍVAR','DGSSA000640','H.I SIMÓN BOLÍVAR'),(75,4,'SIMÓN BOLÍVAR','DGSSA017732','UNIDAD MÓVIL SIMÓN BOLÍVAR, LA ESPERANZA'),(76,5,'SAN JUAN DE GPE','DGSSA001801','SAN JUAN DE GUADALUPE (JEF. ÁREA 5)'),(77,5,'SAN JUAN DE GPE','DGSSA001813','BENITO JUÁREZ'),(78,5,'SAN JUAN DE GPE','DGSSA017720','UNIDAD MÓVIL SAN JUAN DE GPE');






