/* ============================================================
   BASE DE DATOS SIGSS
   Sistema de Información y Gestión de Servicios de Salud
   ============================================================ */

CREATE DATABASE IF NOT EXISTS SIGSS
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE SIGSS;


/* ============================================================
   CATÁLOGOS
   ============================================================ */

CREATE TABLE Cat_Servicio (
    Id_Cat_Servicio INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(30) NOT NULL,
    Clave INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (Id_Cat_Servicio)
) ENGINE=InnoDB;


CREATE TABLE Cat_Teleconsulta_Interpretacion (
    Id_Cat_Teleconsulta_Interpretacion INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(25) NOT NULL,
    Clave INTEGER UNSIGNED NOT NULL,
    Inciso CHAR(1) NOT NULL,
    PRIMARY KEY (Id_Cat_Teleconsulta_Interpretacion)
) ENGINE=InnoDB;


CREATE TABLE Cat_Referido_Nivel (
    Id_Cat_Referido_Nivel INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(30) NOT NULL,
    Clave INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (Id_Cat_Referido_Nivel)
) ENGINE=InnoDB;


CREATE TABLE Cat_Riesgos (
    Id_Cat_Riesgos INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(30) NOT NULL,
    Clave INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (Id_Cat_Riesgos)
) ENGINE=InnoDB;


CREATE TABLE Cat_Tipo_Personal (
    Id_Tipo_Personal INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(30) NOT NULL,
    Clave INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (Id_Tipo_Personal)
) ENGINE=InnoDB;


CREATE TABLE Cat_Diagnosticos (
    Id_Cat_Diagnosticos INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(60) NOT NULL,
    Clave INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (Id_Cat_Diagnosticos)
) ENGINE=InnoDB;


CREATE TABLE Cat_Derechohabiencia (
    Id_Cat_Derechohabiencia INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(30) NOT NULL,
    Clave INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (Id_Cat_Derechohabiencia)
) ENGINE=InnoDB;


CREATE TABLE Cat_Complicaciones (
    Id_Cat_Complicaciones INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(40) NOT NULL,
    Clave INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (Id_Cat_Complicaciones)
) ENGINE=InnoDB;


CREATE TABLE Cat_Discapacidades (
    Id_Discapacidad INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(30) NOT NULL,
    Clave INTEGER UNSIGNED NOT NULL,
    Inciso CHAR(1) NOT NULL,
    PRIMARY KEY (Id_Discapacidad)
) ENGINE=InnoDB;


CREATE TABLE Cat_Referido_Motivo (
    Id_Cat_Referido_Motivo INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(30) NOT NULL,
    Clave INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (Id_Cat_Referido_Motivo)
) ENGINE=InnoDB;


CREATE TABLE Cat_Medicina_Tradicional (
    Id_Cat_Medicina_Tradicional INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(30) NOT NULL,
    Clave VARCHAR(6) NOT NULL,
    PRIMARY KEY (Id_Cat_Medicina_Tradicional)
) ENGINE=InnoDB;


CREATE TABLE Cat_Intervenciones_Gerontologicas (
    Id_Cat_Intervenciones_Gerontologicas INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(40) NOT NULL,
    Clave INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (Id_Cat_Intervenciones_Gerontologicas)
) ENGINE=InnoDB;


/* ============================================================
   ROLES
   ============================================================ */

CREATE TABLE Roles (
    Id_Rol INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(30) NOT NULL,
    Descripcion TEXT NOT NULL,
    PRIMARY KEY (Id_Rol)
) ENGINE=InnoDB;


/* ============================================================
   UNIDADES
   ============================================================ */

CREATE TABLE Unidades (
    Id_Unidad INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    CLUES VARCHAR(30) NOT NULL,
    Nombre VARCHAR(40) NOT NULL,
    Municipio VARCHAR(25) NOT NULL,
    Area INTEGER UNSIGNED NOT NULL,
    PRIMARY KEY (Id_Unidad)
) ENGINE=InnoDB;


/* ============================================================
   PACIENTES
   ============================================================ */

CREATE TABLE Pacientes (
    Id_Paciente INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    Nombre VARCHAR(30) NOT NULL,
    Apellido_Paterno VARCHAR(30) NOT NULL,
    Apellido_Materno VARCHAR(30) NOT NULL,
    Fecha_Nacimiento DATE NOT NULL,
    Entidad_Nacimiento VARCHAR(30) NOT NULL,
    Pais_Nacimiento VARCHAR(30) NULL,
    Curp VARCHAR(18) NOT NULL,
    Sexo VARCHAR(10) NOT NULL,
    Es_Afromexicano BOOLEAN NOT NULL DEFAULT FALSE,
    Es_Indigena BOOLEAN NOT NULL DEFAULT FALSE,
    Es_Migrante BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (Id_Paciente),
    UNIQUE KEY UQ_Pacientes_Curp (Curp)
) ENGINE=InnoDB;


/* ============================================================
   USUARIOS
   ============================================================ */

CREATE TABLE Usuarios (
    Id_Usuario INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    Unidades_Id_Unidad INTEGER UNSIGNED NOT NULL,
    Roles_Id_Rol INTEGER UNSIGNED NOT NULL,
    Nombre VARCHAR(30) NOT NULL,
    Apellido_Paterno VARCHAR(30) NOT NULL,
    Apellido_Materno VARCHAR(30) NOT NULL,
    Nombre_Usuario VARCHAR(20) NOT NULL,
    Contrasena VARCHAR(255) NOT NULL,
    Activo BOOLEAN NOT NULL DEFAULT FALSE,
    Ultimo_Acceso DATETIME NULL,

    PRIMARY KEY (Id_Usuario),

    UNIQUE KEY UQ_Usuarios_Nombre_Usuario (Nombre_Usuario),

    CONSTRAINT FK_Usuarios_Unidades
        FOREIGN KEY (Unidades_Id_Unidad)
        REFERENCES Unidades (Id_Unidad),

    CONSTRAINT FK_Usuarios_Roles
        FOREIGN KEY (Roles_Id_Rol)
        REFERENCES Roles (Id_Rol)
) ENGINE=InnoDB;


/* ============================================================
   PRESTADORES
   ============================================================ */

CREATE TABLE Prestadores (
    Id_Prestador INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    Cat_Tipo_Personal_Id_Tipo_Personal INTEGER UNSIGNED NOT NULL,
    Unidades_Id_Unidad INTEGER UNSIGNED NOT NULL,
    Curp VARCHAR(18) NOT NULL,
    Nombre VARCHAR(30) NOT NULL,
    Apellido_Paterno VARCHAR(30) NOT NULL,
    Apellido_Materno VARCHAR(30) NOT NULL,
    Cedula_Profesional VARCHAR(20) NULL,

    PRIMARY KEY (Id_Prestador),

    UNIQUE KEY UQ_Prestadores_Curp (Curp),

    CONSTRAINT FK_Prestadores_TipoPersonal
        FOREIGN KEY (Cat_Tipo_Personal_Id_Tipo_Personal)
        REFERENCES Cat_Tipo_Personal (Id_Tipo_Personal),

    CONSTRAINT FK_Prestadores_Unidades
        FOREIGN KEY (Unidades_Id_Unidad)
        REFERENCES Unidades (Id_Unidad)
) ENGINE=InnoDB;


/* ============================================================
   CONSULTAS
   ============================================================ */

CREATE TABLE Consultas (
    Id_Consulta INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,

    Cat_IG_Id_Cat_Intervenciones_Gerontologicas
        INTEGER UNSIGNED NULL,

    Cat_Servicio_Id_Cat_Especialidad
        INTEGER UNSIGNED NULL,

    Cat_Referido_Nivel_Id_Cat_Referido_Nivel
        INTEGER UNSIGNED NULL,

    Cat_Referido_Motivo_Id_Cat_Referido_Motivo
        INTEGER UNSIGNED NULL,

    Cat_Derechohabiencia_Id_Cat_Derechohabiencia
        INTEGER UNSIGNED NOT NULL,

    Prestadores_Id_Prestador
        INTEGER UNSIGNED NOT NULL,

    Unidades_Id_Unidad
        INTEGER UNSIGNED NOT NULL,

    Pacientes_Id_Paciente
        INTEGER UNSIGNED NOT NULL,

    Cat_Servicio_Id_Cat_Servicio
        INTEGER UNSIGNED NOT NULL,

    Edad INTEGER UNSIGNED NOT NULL,

    Clave_Edad CHAR(1) NOT NULL,

    Folio_Receta VARCHAR(15) NULL,

    Expediente VARCHAR(15) NULL,

    Primera_Vez_Uneme VARCHAR(15) NULL,

    Primera_Vez_Anio_Cobertura VARCHAR(15) NULL,

    Contrarreferido BOOLEAN NULL,

    Intervencion_Salud_Mental INTEGER UNSIGNED NULL,

    Primera_Vez INTEGER UNSIGNED NULL,

    Subsecuente INTEGER UNSIGNED NULL,

    Confirmacion_Diagnostica INTEGER UNSIGNED NULL,

    RT_Por_Motivo INTEGER UNSIGNED NULL,

    Fecha_Proxima_Cita DATETIME NULL,

    Fecha_Consulta DATETIME NOT NULL,

    PRIMARY KEY (Id_Consulta),

    CONSTRAINT FK_Consultas_Intervenciones
        FOREIGN KEY (
            Cat_IG_Id_Cat_Intervenciones_Gerontologicas
        )
        REFERENCES Cat_Intervenciones_Gerontologicas (
            Id_Cat_Intervenciones_Gerontologicas
        ),

    CONSTRAINT FK_Consultas_Especialidad
        FOREIGN KEY (Cat_Servicio_Id_Cat_Especialidad)
        REFERENCES Cat_Servicio (Id_Cat_Servicio),

    CONSTRAINT FK_Consultas_ReferidoNivel
        FOREIGN KEY (Cat_Referido_Nivel_Id_Cat_Referido_Nivel)
        REFERENCES Cat_Referido_Nivel (Id_Cat_Referido_Nivel),

    CONSTRAINT FK_Consultas_ReferidoMotivo
        FOREIGN KEY (Cat_Referido_Motivo_Id_Cat_Referido_Motivo)
        REFERENCES Cat_Referido_Motivo (Id_Cat_Referido_Motivo),

    CONSTRAINT FK_Consultas_Derechohabiencia
        FOREIGN KEY (Cat_Derechohabiencia_Id_Cat_Derechohabiencia)
        REFERENCES Cat_Derechohabiencia (Id_Cat_Derechohabiencia),

    CONSTRAINT FK_Consultas_Prestador
        FOREIGN KEY (Prestadores_Id_Prestador)
        REFERENCES Prestadores (Id_Prestador),

    CONSTRAINT FK_Consultas_Unidad
        FOREIGN KEY (Unidades_Id_Unidad)
        REFERENCES Unidades (Id_Unidad),

    CONSTRAINT FK_Consultas_Paciente
        FOREIGN KEY (Pacientes_Id_Paciente)
        REFERENCES Pacientes (Id_Paciente),

    CONSTRAINT FK_Consultas_Servicio
        FOREIGN KEY (Cat_Servicio_Id_Cat_Servicio)
        REFERENCES Cat_Servicio (Id_Cat_Servicio)
) ENGINE=InnoDB;


/* ============================================================
   MEDICIONES
   ============================================================ */

CREATE TABLE Mediciones (
    Id_Medicion INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,

    Consultas_Id_Consulta INTEGER UNSIGNED NOT NULL,

    Peso VARCHAR(10) NULL,
    Talla VARCHAR(10) NULL,
    Circunferencia_Cintura VARCHAR(10) NULL,
    Presion_Sistolica VARCHAR(10) NULL,
    Presion_Diastolica VARCHAR(10) NULL,
    Frecuencia_Cardiaca VARCHAR(10) NULL,
    Frecuencia_Respiratoria VARCHAR(10) NULL,
    Temperatura VARCHAR(10) NULL,
    Saturacion_Oxigeno VARCHAR(10) NULL,
    Resultado_Glucosa VARCHAR(15) NULL,
    Glucosa_Ayuno VARCHAR(10) NULL,
    Numero_Tiras INTEGER UNSIGNED NULL,
    Probable_Tb VARCHAR(20) NULL,

    PRIMARY KEY (Id_Medicion),

    UNIQUE KEY UQ_Mediciones_Consulta (Consultas_Id_Consulta),

    CONSTRAINT FK_Mediciones_Consultas
        FOREIGN KEY (Consultas_Id_Consulta)
        REFERENCES Consultas (Id_Consulta)
) ENGINE=InnoDB;


/* ============================================================
   PROMOCIÓN DE LA SALUD
   ============================================================ */

CREATE TABLE Promocion_Salud (
    Id_Promocion_Salud INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,

    Consultas_Id_Consulta INTEGER UNSIGNED NOT NULL,

    Consulta_Integrada_Linea_Vida BOOLEAN NULL,

    Presenta_Cartilla BOOLEAN NULL,

    Esquema_Vacunacion INTEGER UNSIGNED NULL,

    Promocion_Albendazol BOOLEAN NULL,

    Sobre_VSO INTEGER UNSIGNED NULL,

    PRIMARY KEY (Id_Promocion_Salud),

    UNIQUE KEY UQ_Promocion_Salud_Consulta (Consultas_Id_Consulta),

    CONSTRAINT FK_Promocion_Salud_Consultas
        FOREIGN KEY (Consultas_Id_Consulta)
        REFERENCES Consultas (Id_Consulta)
) ENGINE=InnoDB;


/* ============================================================
   TELECONSULTAS
   ============================================================ */

CREATE TABLE Teleconsultas (
    Id_Teleconsulta INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,

    Consultas_Id_Consulta INTEGER UNSIGNED NOT NULL,

    Unidad_Consultante BOOLEAN NULL,

    Modalidad INTEGER UNSIGNED NULL,

    PRIMARY KEY (Id_Teleconsulta),

    UNIQUE KEY UQ_Teleconsultas_Consulta (Consultas_Id_Consulta),

    CONSTRAINT FK_Teleconsultas_Consultas
        FOREIGN KEY (Consultas_Id_Consulta)
        REFERENCES Consultas (Id_Consulta)
) ENGINE=InnoDB;


/* ============================================================
   SALUD DEL NIÑO Y ADOLESCENTE
   ============================================================ */

CREATE TABLE Salud_Nino_Adolescente (
    Id_Salud_Nino_Adolescente INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,

    Consultas_Id_Consulta INTEGER UNSIGNED NOT NULL,

    RT_Nino_Sano INTEGER UNSIGNED NULL,

    Tipo INTEGER UNSIGNED NULL,

    Resultado INTEGER UNSIGNED NULL,

    Resultado_Batelle INTEGER UNSIGNED NULL,

    RT_EDA INTEGER UNSIGNED NULL,

    Plan_Tratamiento INTEGER UNSIGNED NULL,

    Recuperado BOOLEAN NULL,

    Sobres_VSO INTEGER UNSIGNED NULL,

    RT_IRA INTEGER UNSIGNED NULL,

    Tipo_Tratamiento INTEGER UNSIGNED NULL,

    RT_Neumonia INTEGER UNSIGNED NULL,

    Aplicacion_Cedula_Cancer INTEGER UNSIGNED NULL,

    Madre_INF_PA VARCHAR(20) NULL,

    PRIMARY KEY (Id_Salud_Nino_Adolescente),

    UNIQUE KEY UQ_Salud_Nino_Adolescente_Consulta
        (Consultas_Id_Consulta),

    CONSTRAINT FK_Salud_Nino_Adolescente_Consultas
        FOREIGN KEY (Consultas_Id_Consulta)
        REFERENCES Consultas (Id_Consulta)
) ENGINE=InnoDB;


/* ============================================================
   SALUD REPRODUCTIVA
   ============================================================ */

CREATE TABLE Salud_Reproductiva (
    Id_Salud_Reproductiva INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,

    Cat_Complicaciones_Id_Cat_Complicaciones
        INTEGER UNSIGNED NULL,

    Cat_Riesgos_Id_Cat_Riesgos
        INTEGER UNSIGNED NULL,

    Consultas_Id_Consulta
        INTEGER UNSIGNED NOT NULL,

    RT_Pregestacional INTEGER UNSIGNED NULL,

    RT_Embarazo INTEGER UNSIGNED NULL,

    Plan_Seguridad INTEGER UNSIGNED NULL,

    Trimestre_Gestacional INTEGER UNSIGNED NULL,

    Alto_Riesgo_Primera_Vez BOOLEAN NULL,

    Otras_Acciones INTEGER UNSIGNED NULL,

    RT_Puerperio INTEGER UNSIGNED NULL,

    RT_Infeccion_Puerperial INTEGER UNSIGNED NULL,

    Terapia_Hormonal BOOLEAN NULL,

    PRIMARY KEY (Id_Salud_Reproductiva),

    UNIQUE KEY UQ_Salud_Reproductiva_Consulta
        (Consultas_Id_Consulta),

    CONSTRAINT FK_Salud_Reproductiva_Complicaciones
        FOREIGN KEY (Cat_Complicaciones_Id_Cat_Complicaciones)
        REFERENCES Cat_Complicaciones (Id_Cat_Complicaciones),

    CONSTRAINT FK_Salud_Reproductiva_Riesgos
        FOREIGN KEY (Cat_Riesgos_Id_Cat_Riesgos)
        REFERENCES Cat_Riesgos (Id_Cat_Riesgos),

    CONSTRAINT FK_Salud_Reproductiva_Consultas
        FOREIGN KEY (Consultas_Id_Consulta)
        REFERENCES Consultas (Id_Consulta)
) ENGINE=InnoDB;


/* ============================================================
   RELACIÓN N:M - DISCAPACIDADES
   ============================================================ */

CREATE TABLE Consulta_Discapacidades (
    Cat_Discapacidades_Id_Discapacidad
        INTEGER UNSIGNED NOT NULL,

    Consultas_Id_Consulta
        INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (
        Cat_Discapacidades_Id_Discapacidad,
        Consultas_Id_Consulta
    ),

    CONSTRAINT FK_Consulta_Discapacidades_Discapacidad
        FOREIGN KEY (Cat_Discapacidades_Id_Discapacidad)
        REFERENCES Cat_Discapacidades (Id_Discapacidad),

    CONSTRAINT FK_Consulta_Discapacidades_Consulta
        FOREIGN KEY (Consultas_Id_Consulta)
        REFERENCES Consultas (Id_Consulta)
) ENGINE=InnoDB;


/* ============================================================
   RELACIÓN N:M - DIAGNÓSTICOS
   ============================================================ */

CREATE TABLE Consulta_Diagnosticos (
    Consultas_Id_Consulta
        INTEGER UNSIGNED NOT NULL,

    Cat_Diagnosticos_Id_Cat_Diagnosticos
        INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (
        Consultas_Id_Consulta,
        Cat_Diagnosticos_Id_Cat_Diagnosticos
    ),

    CONSTRAINT FK_Consulta_Diagnosticos_Consulta
        FOREIGN KEY (Consultas_Id_Consulta)
        REFERENCES Consultas (Id_Consulta),

    CONSTRAINT FK_Consulta_Diagnosticos_Diagnostico
        FOREIGN KEY (Cat_Diagnosticos_Id_Cat_Diagnosticos)
        REFERENCES Cat_Diagnosticos (Id_Cat_Diagnosticos)
) ENGINE=InnoDB;


/* ============================================================
   RELACIÓN N:M - MEDICINA TRADICIONAL
   ============================================================ */

CREATE TABLE Consulta_Medicina_Tradicional (
    Cat_Medicina_Tradicional_Id_Cat_Medicina_Tradicional
        INTEGER UNSIGNED NOT NULL,

    Consultas_Id_Consulta
        INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (
        Cat_Medicina_Tradicional_Id_Cat_Medicina_Tradicional,
        Consultas_Id_Consulta
    ),

    CONSTRAINT FK_Consulta_Medicina_Tradicional_Catalogo
        FOREIGN KEY (
            Cat_Medicina_Tradicional_Id_Cat_Medicina_Tradicional
        )
        REFERENCES Cat_Medicina_Tradicional (
            Id_Cat_Medicina_Tradicional
        ),

    CONSTRAINT FK_Consulta_Medicina_Tradicional_Consulta
        FOREIGN KEY (Consultas_Id_Consulta)
        REFERENCES Consultas (Id_Consulta)
) ENGINE=InnoDB;


/* ============================================================
   RELACIÓN N:M - INTERPRETACIÓN DE TELECONSULTAS
   ============================================================ */

CREATE TABLE Teleconsultas_Interpretacion (
    Cat_TI_Id_Cat_TI
        INTEGER UNSIGNED NOT NULL,

    Teleconsultas_Id_Teleconsulta
        INTEGER UNSIGNED NOT NULL,

    PRIMARY KEY (
        Cat_TI_Id_Cat_TI,
        Teleconsultas_Id_Teleconsulta
    ),

    CONSTRAINT FK_Teleconsultas_Interpretacion_Catalogo
        FOREIGN KEY (
            Cat_TI_Id_Cat_TI
        )
        REFERENCES Cat_Teleconsulta_Interpretacion (
            Id_Cat_Teleconsulta_Interpretacion
        ),

    CONSTRAINT FK_Teleconsultas_Interpretacion_Teleconsulta
        FOREIGN KEY (Teleconsultas_Id_Teleconsulta)
        REFERENCES Teleconsultas (Id_Teleconsulta)
) ENGINE=InnoDB;


/* ============================================================
   BITÁCORA
   ============================================================ */

CREATE TABLE Bitacora (
    Id_Bitacora INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,

    Usuarios_Id_Usuario INTEGER UNSIGNED NOT NULL,

    Fecha_Hora DATETIME NOT NULL,

    Modulo VARCHAR(20) NOT NULL,

    Accion VARCHAR(40) NOT NULL,

    Tabla_Afectada VARCHAR(25) NOT NULL,

    PRIMARY KEY (Id_Bitacora),

    CONSTRAINT FK_Bitacora_Usuarios
        FOREIGN KEY (Usuarios_Id_Usuario)
        REFERENCES Usuarios (Id_Usuario)
) ENGINE=InnoDB;

/* ============================================================
   DATOS
   ============================================================ */
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

INSERT INTO Cat_Teleconsulta_Interpretacion (Nombre, Clave, Inciso) VALUES
('NO', 0, 'a'),
('SÍ', 1, 'a'),
('USG', 1, 'b'),
('ECG', 2, 'b'),
('RAYOS X', 3, 'b'),
('TOMOGRAFÍA', 4, 'b'),
('RESONANCIA MAGNÉTICA', 5, 'b'),
('MASTOGRAFÍA', 6, 'b'),
('PRUEBA DE EMBARAZO CUANTITATIVA hGC', 8, 'b'),
('OTROS', 7, 'b');

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

INSERT INTO Cat_Riesgos (Nombre, Clave) VALUES
('PATOLOGÍA CRÓNICA ÓRGANO FUNCIONAL', 1),
('PATOLOGÍA CRÓNICA INFECCIOSA', 2),
('ANTECEDENTES DE MORBILIDAD MATERNA EXTREMA', 3),
('CON FACTORES DE RIESGOS SOCIALES', 4),
('ANTECEDENTES OBSTÉTRICOS DE RIESGO', 5),
('SIN RIESGO', 9);

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

