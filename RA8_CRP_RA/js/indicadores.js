const tabla = document.getElementById("tablaIndicadores");
const form = document.getElementById("formIndicador");
const filtroTipo = document.getElementById("filtroTipo");
const filtroNombre = document.getElementById("filtroNombre");

let todosLosIndicadores = [];

async function cargarIndicadores() {
  todosLosIndicadores = await getIndicadores();
  aplicarFiltros();
}

function aplicarFiltros() {
  const textoNombre = filtroNombre.value.toLowerCase();
  const tipoSeleccionado = filtroTipo.value;

  const datosFiltrados = todosLosIndicadores.filter(i => {
    const cumpleNombre = i.nombre.toLowerCase().includes(textoNombre);
    const cumpleTipo = !tipoSeleccionado || i.tipo === tipoSeleccionado;
    return cumpleNombre && cumpleTipo;
  });

  renderizarTabla(datosFiltrados);
}

function renderizarTabla(datos) {
  tabla.innerHTML = "";

  datos.forEach(i => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${i.nombre}</td>
      <td>${i.tipo}</td>
      <td>${i.valor}</td>
      <td>
        <button class="btn btn-sm btn-info">Ver más</button>
        <button class="btn btn-sm btn-warning">Editar</button>
        <button class="btn btn-sm btn-danger">Eliminar</button>
      </td>
    `;
    
    const btnVerMas = tr.querySelector('.btn-info');
    const btnEditar = tr.querySelector('.btn-warning');
    const btnEliminar = tr.querySelector('.btn-danger');
    
    btnVerMas.addEventListener('click', () => verDetalles(i));
    btnEditar.addEventListener('click', () => editar(i));
    btnEliminar.addEventListener('click', () => borrar(i.id));
    
    tabla.appendChild(tr);
  });
}

function verDetalles(indicador) {
  document.getElementById('detalle-nombre').textContent = indicador.nombre;
  document.getElementById('detalle-tipo').textContent = indicador.tipo;
  document.getElementById('detalle-ambito').textContent = indicador.ambito || 'N/A';
  document.getElementById('detalle-categoria').textContent = indicador.categoria || 'N/A';
  document.getElementById('detalle-valor').textContent = indicador.valor;
  
  const modal = new bootstrap.Modal(document.getElementById('modalDetalles'));
  modal.show();
}

// Event listeners para filtros
filtroTipo.addEventListener('change', aplicarFiltros);
filtroNombre.addEventListener('input', aplicarFiltros);

form.addEventListener("submit", async e => {
  e.preventDefault();

  const indicador = {
    Nombre: nombre.value,
    Tipo: tipo.value,
    Ambito: ambito.value,
    Categoria: categoria.value,
    Valor: valor.value
  };

  try {
    if (idIndicador.value) {
      indicador.Id = parseInt(idIndicador.value);
      await actualizarIndicador(idIndicador.value, indicador);
      alert('Indicador actualizado correctamente');
    } else {
      await crearIndicador(indicador);
      alert('Indicador creado correctamente');
    }

    form.reset();
    idIndicador.value = "";
    await cargarIndicadores();
  } catch (error) {
    console.error('Error:', error);
    alert('Error: ' + error.message);
  }
});

function editar(i) {
  console.log('Editando:', i);
  idIndicador.value = i.id;
  nombre.value = i.nombre;
  tipo.value = i.tipo;
  ambito.value = i.ambito || '';
  categoria.value = i.categoria || '';
  valor.value = i.valor;
}

async function borrar(id) {
  if (confirm("¿Eliminar indicador?")) {
    await eliminarIndicador(id);
    await cargarIndicadores();
  }
}

cargarIndicadores();
