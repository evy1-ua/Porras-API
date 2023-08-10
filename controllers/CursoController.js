const Cursos = require("../models/Cursos");
const Categoria = require("../models/Categoria");
const Semanas = require("../models/Semanas");

const CursoController = {
  createCurso: (req, res) => {
    const { nombre, descripcion, duracion, nivel, categoria } = req.body;
    const foto = req.file ? req.file.filename : null;
    const nuevoCurso = new Cursos(
      null,
      nombre,
      descripcion,
      foto,
      duracion,
      nivel,
      categoria
    );
    nuevoCurso.save((error, nuevoCursoGuardado) => {
      if (error) {
        console.error("Error al guardar el curso:", error);
        res.status(500).json({ error: "Error al guardar el curso" });
      } else {
        res.status(201).json(nuevoCursoGuardado);
      }
    });
  },
  // Controlador para actualizar invitacion y marcarla como usada
  updateCurso: (req, res) => {
    const { id, nombre, descripcion, foto, duracion, nivel, categoria } =
      req.body;
    const CursoUpdate = new Cursos(
      id,
      nombre,
      descripcion,
      foto,
      duracion,
      nivel,
      categoria
    );
    curso.update((error, cursoActualizado) => {
      if (error) {
        console.error("Error al actualizar el curso:", error);
        return res.status(500).json({ error: "Error al actualizar el curso" });
      }
      return res.status(200).json(cursoActualizado);
    });
  },
  deleteCurso: (req, res) => {
    const { id } = req.params;
    const cursoToDelete = new Cursos(id, null, null, null, null, null, null);

    cursoToDelete.delete((error) => {
      if (error) {
        console.error("Error al eliminar el curso:", error);
        return res.status(500).json({ error: "Error al eliminar el curso" });
      }
      res.json({ message: "Curso eliminado correctamente" });
    });
  },
  // Agregar una nueva categoría
  addCategoria: (req, res) => {
    const { nombre } = req.body;
    const nuevaCategoria = new Categoria(null, nombre);

    nuevaCategoria.save((error, categoriaCreada) => {
      if (error) {
        console.error("Error al agregar la categoría:", error);
        return res.status(500).json({ error: "Error al agregar la categoría" });
      }
      res.json(categoriaCreada);
    });
  },
  // Actualizar una categoría
  updateCategoria: (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;
    const categoriaActualizada = new Categoria(id, nombre);

    categoriaActualizada.update((error, categoriaActualizada) => {
      if (error) {
        console.error("Error al actualizar la categoría:", error);
        return res
          .status(500)
          .json({ error: "Error al actualizar la categoría" });
      }
      res.json(categoriaActualizada);
    });
  },
  // Eliminar una categoría
  deleteCategoria: (req, res) => {
    const { id } = req.params;
    const categoriaAEliminar = new Categoria(id, null);

    categoriaAEliminar.delete((error) => {
      if (error) {
        console.error("Error al eliminar la categoría:", error);
        return res
          .status(500)
          .json({ error: "Error al eliminar la categoría" });
      }
      res.json({ message: "Categoría eliminada correctamente" });
    });
  },
  // Obtener una categoría por su ID
  getCategoriaById: (req, res) => {
    const { id } = req.params;
    Categoria.getById(id, (error, categoria) => {
      if (error) {
        console.error("Error al obtener la categoría:", error);
        return res.status(500).json({ error: "Error al obtener la categoría" });
      }
      if (!categoria) {
        return res.status(404).json({ error: "Categoría no encontrada" });
      }
      res.json(categoria);
    });
  },
  //Obtener todas las categorias
  getAllCategorias: (req, res) => {
    Categoria.getAllCategorias((error, categorias) => {
      if (error) {
        console.error("Error al obtener las categorías:", error);
        return res
          .status(500)
          .json({ error: "Error al obtener las categorías" });
      }
      res.json(categorias);
    });
  },
  // Agregar una nueva semana a un curso
  addSemanaToCurso: (req, res) => {
    const { curso_id, semanas } = req.body;

    // Array para almacenar las semanas creadas
    const semanasCreadas = [];

    // Función para crear y guardar una nueva semana
    const crearYGuardarSemana = (numeroSemana) => {
      const nombreSemana = `Sesión ${numeroSemana}`;
      const nuevaSemana = new Semanas(null, curso_id, nombreSemana);

      return new Promise((resolve, reject) => {
        nuevaSemana.save((error, semanaCreada) => {
          if (error) {
            console.error("Error al agregar la semana:", error);
            reject(error);
          } else {
            semanasCreadas.push(semanaCreada);
            resolve();
          }
        });
      });
    };

    // Crear y guardar las semanas utilizando un bucle
    const promises = [];
    for (let i = 1; i <= semanas; i++) {
      promises.push(crearYGuardarSemana(i));
    }

    // Esperar a que todas las promesas se resuelvan
    Promise.all(promises)
      .then(() => {
        res.json(semanasCreadas);
      })
      .catch((error) => {
        res.status(500).json({ error: "Error al agregar las semanas" });
      });
  },
  // Obtener todas las semanas de un curso específico
  getAllSemanasByCursoId: (req, res) => {
    const { curso_id } = req.params;
    Semanas.getAllSemanasByCursoId(curso_id, (error, semanas) => {
      if (error) {
        console.error("Error al obtener las semanas:", error);
        return res.status(500).json({ error: "Error al obtener las semanas" });
      }
      res.json(semanas);
    });
  },
  // Agregar un profesor de supervisión a un curso
  addProfesorToCurso: (req, res) => {
    const { curso_id, id_profesor } = req.body;
    const curso = new Cursos(curso_id, null, null, null, null, null, null);
    curso.addSupervision(id_profesor, (error, result) => {
      if (error) {
        console.error("Error al agregar el profesor de supervisión:", error);
        return res
          .status(500)
          .json({ error: "Error al agregar el profesor de supervisión" });
      }
      res.json({ message: "Profesor de supervisión agregado correctamente" });
    });
  },
  // Eliminar la supervisión de un profesor en un curso
  removeProfesorFromCurso: (req, res) => {
    const { curso_id, id_profesor } = req.body;
    Cursos.removeProfesorFromCurso(curso_id, id_profesor, (error) => {
      if (error) {
        console.error("Error al eliminar la supervisión del profesor:", error);
        return res
          .status(500)
          .json({ error: "Error al eliminar la supervisión del profesor" });
      }
      res.json({ message: "Supervisión del profesor eliminada correctamente" });
    });
  },
  // Obtener los profesores que supervisan un curso
  getProfesoresSupervisoresByCursoId: (req, res) => {
    const { curso_id } = req.params;
    Cursos.getProfesoresSupervisoresByCursoId(curso_id, (error, profesores) => {
      if (error) {
        console.error("Error al obtener los profesores supervisores:", error);
        return res
          .status(500)
          .json({ error: "Error al obtener los profesores supervisores" });
      }
      res.json(profesores);
    });
  },
  //Obtener los ultimos cursos añadidos
  getLastCourses: (req, res) => {
    Cursos.getLastCourses((error, courses) => {
      if (error) {
        console.error('Error al obtener los últimos cursos:', error);
        return res.status(500).json({ error: 'Error al obtener los últimos cursos' });
      }
      res.json(courses);
    });
  },
  // Función para obtener las semanas de un curso por su ID
  getSemanasByCursoId: (req, res) => {
    const cursoId = req.params.id;

    Cursos.getSemanasByCursoId(cursoId, (error, semanas) => {
      if (error) {
        console.error('Error al obtener las semanas del curso:', error);
        return res.status(500).json({ error: 'Error al obtener las semanas del curso' });
      }
      res.json(semanas);
    });
  },
};

module.exports = CursoController;
