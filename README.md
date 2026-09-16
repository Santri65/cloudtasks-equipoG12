# cloudtasks-equipoG12

Aplicación web para la gestión de tareas personales o de un equipo de trabajo, desarrollada como parte del **Laboratorio Desafío** del Seminario de Ingeniería de Software de la **Universidad ICESI**.

El proyecto permite crear, visualizar, completar y eliminar tareas mediante una interfaz web. La aplicación utiliza HTML, CSS y JavaScript para su funcionamiento, Supabase/PostgreSQL para almacenar los datos y Vercel para realizar el despliegue de la aplicación.

## Funcionalidades

* Crear nuevas tareas.

* Visualizar las tareas registradas.

* Marcar tareas como completadas o pendientes.

* Eliminar tareas.

* Filtrar tareas por prioridad.

* Filtrar tareas según su fecha límite.

* Mostrar un resumen con el número total de tareas.

* Mostrar la cantidad de tareas pendientes.

* Mostrar la cantidad de tareas completadas.

* Mostrar la prioridad de cada tarea.

* Mostrar la fecha límite de cada tarea.

* Indicar visualmente cuando una tarea está completada.

* Validar que el título de una tarea no esté vacío.

## Filtros disponibles

CloudTasks incluye un sistema de filtros para facilitar la búsqueda y organización de las tareas.

### Filtro por prioridad

Permite mostrar:

* Todas las prioridades.

* Tareas de prioridad baja (`low`).

* Tareas de prioridad media (`medium`).

* Tareas de prioridad alta (`high`).

### Filtro por fecha

Permite filtrar las tareas según su fecha límite:

* Todas las fechas.

* Hoy.

* Esta semana.

* Este mes.

* Próximas.

* Vencidas.

* Sin fecha límite.

## Modelo de datos

Cada tarea utiliza los siguientes campos:

| Campo | Descripción |
| ------------- | ------------------------------------------------ |
| `id` | Identificador único de la tarea. |
| `title` | Título de la tarea. |
| `description` | Descripción de la tarea. |
| `completed` | Indica si la tarea está completada. |
| `created_at` | Fecha y hora en que se creó la tarea. |
| `deadline` | Fecha límite de la tarea. |
| `priority` | Prioridad de la tarea: `low`, `medium` o `high`. |

Los datos de las tareas se almacenan en una tabla de PostgreSQL administrada mediante Supabase. De esta manera, la información no depende únicamente del estado temporal de la página y puede mantenerse después de recargar la aplicación.

## Integración con Supabase

CloudTasks utiliza Supabase como servicio para conectar la aplicación con una base de datos PostgreSQL.

Cuando el usuario crea una tarea, JavaScript obtiene la información del formulario y realiza una solicitud a Supabase para guardar los datos en la tabla `tasks`. De forma similar, la aplicación consulta los datos almacenados para mostrar las tareas y realiza solicitudes para actualizar o eliminar registros cuando el usuario modifica su estado o elimina una tarea.

Esta integración permite que las tareas permanezcan almacenadas en la base de datos y puedan recuperarse nuevamente al cargar la aplicación.

## Despliegue con Vercel

El proyecto está conectado a GitHub y desplegado mediante Vercel. Vercel permite publicar la aplicación para que pueda ser utilizada a través de Internet.

La aplicación se encuentra disponible mediante el dominio proporcionado por Vercel:

`cloudtasks-equipo-g12.vercel.app`

Los cambios realizados en el repositorio pueden ser utilizados para generar nuevos despliegues de la aplicación, manteniendo la versión publicada relacionada con el código del proyecto.

## Tecnologías utilizadas

* **HTML5** — estructura y contenido de la aplicación.

* **CSS** — estilos, distribución visual y diseño responsive.

* **JavaScript** — lógica de la aplicación, manejo de eventos, validaciones, filtros y actualización de la interfaz.

* **Git** — control de versiones.

* **GitHub** — almacenamiento y colaboración sobre el código fuente.

* **Supabase / PostgreSQL** — almacenamiento persistente de las tareas y gestión de la base de datos.

* **Vercel** — despliegue de la aplicación y acceso mediante Internet.

## Estructura del proyecto

```text
cloudtasks/

├── index.html

├── css/

│   └── styles.css

├── js/

│   ├── app.js

│   └── supaBaseClient.js

├── README.md

└── .gitignore