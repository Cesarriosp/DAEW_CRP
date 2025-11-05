class Libro {
  constructor(titulo, autor, anioPublicacion, genero, ISBN) {
    this.titulo = titulo;
    this.autor = autor;
    this.anioPublicacion = anioPublicacion;
    this.genero = genero;
    this.ISBN = ISBN;
  }
}

class Biblioteca {
  constructor() {
    if (Biblioteca._instance) return Biblioteca._instance;
    this.libros = [];
    Biblioteca._instance = this;
  }

  agregarLibro(libro) {
    this.libros.push(libro);
    this.mostrarMensaje(" Libro añadido");
  }

  buscarLibro(termino) {
    if (!termino) return [];
    const t = termino.toLowerCase();
    return this.libros.filter(
      l => l.titulo.toLowerCase().includes(t) || l.ISBN === termino
    );
  }

  listarLibros() {
    return this.libros;
  }

  eliminarLibro(isbn) {
    const antes = this.libros.length;
    this.libros = this.libros.filter(l => l.ISBN !== isbn);
    return this.libros.length < antes;
  }

  obtenerEstadisticas() {
    const total = this.libros.length;
    const porGenero = this.libros.reduce((acc, l) => {
      acc[l.genero] = (acc[l.genero] || 0) + 1;
      return acc;
    }, {});
    const mediaAntig =
      total === 0
        ? 0
        : this.libros
            .map(l => new Date().getFullYear() - Number(l.anioPublicacion || 0))
            .reduce((a, b) => a + b, 0) / total;
    return { total, porGenero, mediaAntig };
  }

  mostrarMensaje(msg) {
    const el = document.getElementById("mensaje");
    if (el) el.textContent = msg;
  }
}


const biblioteca = new Biblioteca();

document.addEventListener("DOMContentLoaded", () => {
  const tituloInput = document.getElementById("titulo");
  const autorInput = document.getElementById("autor");
  const anioInput = document.getElementById("anio");
  const generoInput = document.getElementById("genero");
  const isbnInput = document.getElementById("isbn");
  const btnAgregar = document.getElementById("btnAgregar");

  const buscarInput = document.getElementById("buscar");
  const btnBuscar = document.getElementById("btnBuscar");

  const eliminarInput = document.getElementById("eliminar");
  const btnEliminar = document.getElementById("btnEliminar");

  const btnListar = document.getElementById("btnListar");
  const tablaLibros = document.getElementById("tablaLibros");

  const btnEstadisticas = document.getElementById("btnEstadisticas");
  const statsElement = document.getElementById("stats");

  function mostrarTabla(libros) {
    tablaLibros.innerHTML = `
      <tr>
        <th>Título</th><th>Autor</th><th>Año</th><th>Género</th><th>ISBN</th>
      </tr>
    `;
    if (!libros || libros.length === 0) {
      tablaLibros.innerHTML += `<tr><td colspan="5" style="text-align:center">— Sin resultados —</td></tr>`;
      return;
    }
    const filas = libros.map(l => {
      return `<tr>
        <td>${escapeHtml(l.titulo)}</td>
        <td>${escapeHtml(l.autor)}</td>
        <td>${escapeHtml(l.anioPublicacion)}</td>
        <td>${escapeHtml(l.genero)}</td>
        <td>${escapeHtml(l.ISBN)}</td>
      </tr>`;
    }).join("");
    tablaLibros.innerHTML += filas;
  }

  function escapeHtml(str) {
    if (str === null || str === undefined) return "";
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  btnAgregar.addEventListener("click", () => {
    try {
      const titulo = tituloInput.value.trim();
      const autor = autorInput.value.trim();
      const anio = parseInt(anioInput.value, 10);
      const genero = generoInput.value.trim();
      const isbn = isbnInput.value.trim();

      if (!titulo || !autor || !anio || !genero || !isbn) {
        return biblioteca.mostrarMensaje(" Completa todos los campos");
      }

      biblioteca.agregarLibro(new Libro(titulo, autor, anio, genero, isbn));
      tituloInput.value = autorInput.value = generoInput.value = isbnInput.value = "";
      anioInput.value = "";
      mostrarTabla(biblioteca.listarLibros());
      console.log("Libro añadido:", { titulo, autor, anio, genero, isbn });
    } catch (err) {
      console.error("Error en agregar:", err);
      biblioteca.mostrarMensaje(" Error al añadir (ver consola)");
    }
  });

  btnBuscar.addEventListener("click", () => {
    try {
      const termino = buscarInput.value.trim();
      const resultados = biblioteca.buscarLibro(termino);
      mostrarTabla(resultados);
      console.log("Buscar:", termino, " => ", resultados);
    } catch (err) {
      console.error("Error en buscar:", err);
    }
  });

  btnEliminar.addEventListener("click", () => {
    try {
      const isbn = eliminarInput.value.trim();
      if (!isbn) return biblioteca.mostrarMensaje(" Introduce un ISBN a eliminar");
      const ok = biblioteca.eliminarLibro(isbn);
      biblioteca.mostrarMensaje(ok ? " Libro eliminado" : " ISBN no encontrado");
      mostrarTabla(biblioteca.listarLibros());
      console.log("Eliminar ISBN:", isbn, "=>", ok);
    } catch (err) {
      console.error("Error en eliminar:", err);
    }
  });

  btnListar.addEventListener("click", () => {
    try {
      mostrarTabla(biblioteca.listarLibros());
      console.log("Listar:", biblioteca.listarLibros());
    } catch (err) {
      console.error("Error en listar:", err);
    }
  });

  btnEstadisticas.addEventListener("click", () => {
    try {
      const stats = biblioteca.obtenerEstadisticas();
      statsElement.textContent = ` Total: ${stats.total}\n Por género: ${JSON.stringify(stats.porGenero)}\n Media antigüedad: ${stats.mediaAntig.toFixed(2)} años`;
      console.log("Estadísticas:", stats);
    } catch (err) {
      console.error("Error en estadísticas:", err);
    }
  });

  mostrarTabla([]);
});

