const { createApp, ref, computed, onMounted } = Vue;

createApp({
  setup() {
    const titulo = ref('🎵 Disquería de Vinilo');
    const discos = ref([]);
    const cargando = ref(false);
    const error = ref(null);
    const categoria = ref('todos');
    const busqueda = ref('');

    async function cargarDiscos() {
      try {
        cargando.value = true;
        error.value = null;

        const respuesta = await fetch('data/discos.json');

        if (!respuesta.ok) {
          throw new Error(`Error HTTP: ${respuesta.status}`);
        }

        const datos = await respuesta.json();
        discos.value = datos;

      } catch (err) {
        error.value = 'No se pudo cargar el catálogo.';
        console.error(err);
      } finally {
        cargando.value = false;
      }
    }

    const discosFiltrados = computed(() => {
      return discos.value.filter(d => {
        const porCategoria =
          categoria.value === 'todos' || d.genero === categoria.value;

        const termino = busqueda.value.toLowerCase();

        const porBusqueda =
          d.album.toLowerCase().includes(termino) ||
          d.artista.toLowerCase().includes(termino);

        return porCategoria && porBusqueda;
      });
    });

    onMounted(() => cargarDiscos());

   return {
    titulo,
    discos,
    cargando,
    error,
    categoria,
    busqueda,
    discosFiltrados,
    cargarDiscos
    };
  }
}).mount('#app');