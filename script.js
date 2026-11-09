const inputPais = document.getElementById("pais");
const botonBuscar = document.getElementById("buttonPais");
const contenedorResultado = document.getElementById("resultado");

const API_BASE = "https://flagdex.net/api/v1";

botonBuscar.addEventListener("click", searchCountry);
inputPais.addEventListener("keypress", function (event) {
  if (event.key === "Enter") searchCountry();
});

async function searchCountry() {
  const paisBuscado = inputPais.value.trim();
  if (!paisBuscado) {
    contenedorResultado.innerHTML =
      "<p class='error'>Por favor, ingresa el nombre de un país.</p>";
    return;
  }

  contenedorResultado.innerHTML = "<p class='loading'>Buscando país...</p>";

  try {
    const resLista = await fetch(`${API_BASE}/countries-lite.json`);
    if (!resLista.ok) throw new Error(`Error al cargar la lista: ${resLista.status}`);

    const listaPaises = await resLista.json();

    const paisEncontrado = listaPaises.find(
      (p) => p.name.toLowerCase() === paisBuscado.toLowerCase()
    );

    if (!paisEncontrado) {
      throw new Error("No se encontró ningún país con ese nombre. Recuerda escribirlo en inglés.");
    }

    const iso2 = paisEncontrado.iso2.toLowerCase();
    const resDetalle = await fetch(`${API_BASE}/country/${iso2}.json`);
    if (!resDetalle.ok) throw new Error(`Error al obtener detalles: ${resDetalle.status}`);

    const pais = await resDetalle.json();

    const nombre = pais.name || "No disponible";
    const capital = pais.capital?.[0] || "No disponible";
    const poblacion = pais.population
      ? pais.population.toLocaleString("es-ES")
      : "No disponible";
    const idiomas = pais.languages?.join(", ") || "No disponible";

    const banderaUrl = `https://flagdex.net/flags/${iso2}.svg`;

    mostrarEnPantalla(nombre, capital, poblacion, banderaUrl, idiomas);
  } catch (error) {
    console.error("Error detallado:", error);
    contenedorResultado.innerHTML = `<p class="error"><strong>Error:</strong> ${error.message}</p>`;
  }
}

function mostrarEnPantalla(nombre, capital, poblacion, banderaUrl, idiomas) {
  contenedorResultado.innerHTML = `
        <div class="pais-card">
            <img src="${banderaUrl}" alt="Bandera de ${nombre}" class="bandera">
            <h2>${nombre}</h2>
            <ul>
                <li><strong>Capital:</strong> ${capital}</li>
                <li><strong>Población:</strong> ${poblacion} habitantes</li>
                <li><strong>Idioma(s):</strong> ${idiomas}</li>
            </ul>
        </div>
    `;
}