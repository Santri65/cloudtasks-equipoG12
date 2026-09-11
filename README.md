# cloudtasks-equipoG12

Aplicación web para la gestión de tareas personales o de un equipo de trabajo, desarrollada como parte del **Laboratorio Desafío** del Seminario de Ingeniería de Software de la **Universidad ICESI**.

El proyecto permite crear, visualizar, completar y eliminar tareas mediante una interfaz web. Actualmente cuenta con una implementación local utilizando HTML, CSS y JavaScript, y está preparado para incorporar persistencia de datos mediante Supabase/PostgreSQL.

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
* Validar que la fecha límite no sea anterior a la fecha actual.
* Adaptar la interfaz a diferentes tamaños de pantalla.

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

| Campo         | Descripción                                      |
| ------------- | ------------------------------------------------ |
| `id`          | Identificador único de la tarea.                 |
| `title`       | Título de la tarea.                              |
| `description` | Descripción de la tarea.                         |
| `completed`   | Indica si la tarea está completada.              |
| `created_at`  | Fecha y hora en que se creó la tarea.            |
| `deadline`    | Fecha límite de la tarea.                        |
| `priority`    | Prioridad de la tarea: `low`, `medium` o `high`. |

En la implementación local, estos datos se almacenan temporalmente en el arreglo `tasks`. La creación de una tarea agrega un nuevo objeto al arreglo y las operaciones de completar y eliminar modifican este estado local.

## Tecnologías utilizadas

* **HTML5** — estructura y contenido de la aplicación.
* **CSS3** — estilos, distribución visual y diseño responsive.
* **JavaScript (Vanilla)** — lógica de la aplicación, manejo de eventos, validaciones, filtros y actualización de la interfaz.
* **Git** — control de versiones.
* **GitHub** — almacenamiento y colaboración sobre el código fuente.
* **Supabase / PostgreSQL** — persistencia de datos prevista para la integración de la Etapa 2.
* **Vercel** — plataforma prevista para el despliegue de la aplicación.

## Estructura del proyecto

```text
cloudtasks/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── app.js
│   └── supabase.js
├── README.md
└── .gitignore
```