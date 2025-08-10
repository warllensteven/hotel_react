const API = "https://servidor-j7p3.onrender.com";

const dibujarHabitaciones = (elemHtml) => {
  elemHtml.innerHTML = "";
  fetch(`${API}/habitaciones`)
    .then((response) => response.json())
    .then((data) => {
      const habitaciones = data;
      const tiposUnicos = [...new Set(habitaciones.map((h) => h.tipo))];
      tiposUnicos.forEach((tipo) => {
        const habitacionEjemplo = habitaciones.find(
          (h) =>
            h.tipo === tipo &&
            h.id ===
              Math.min(
                ...habitaciones.filter((h) => h.tipo === tipo).map((h) => h.id)
              )
        );
        const botonClass = sessionStorage.getItem("email")
          ? "permitir-reservar"
          : "reservar";
        elemHtml.innerHTML += `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300">
              <img src="${habitacionEjemplo.img}" alt="${tipo}" class="w-full h-48 object-cover img-habitacion" />
              <div class="p-4">
                <h3 class="text-xl font-bold text-gray-800 mb-2">${tipo}</h3>
                <p class="text-gray-600 text-sm mb-4">${habitacionEjemplo.descripcion}</p>
                <ul class="text-sm text-gray-500">
                  <li>✔ Wi-Fi</li>
                  <li>✔ TV</li>
                  <li>✔ Baño privado</li>
                </ul>
                <h3 class="text-xl font-bold text-green-800 mb-2 my-2">${habitacionEjemplo.precio}</h3>
              </div>
              <div class="p-3 flex justify-center">
                <button class="${botonClass} bg-violet-500 text-white font-semibold rounded px-4 py-2 hover:bg-blue-600 transition-colors duration-300" id="reservar-${habitacionEjemplo.id}">
                  Reservar
                </button>
              </div>
            </div>`;
      });
      mostrarFormReserva();
    })
    .catch((error) => {
      elemHtml.innerHTML = `<p class="text-red-500">Error al cargar habitaciones.</p>`;
    });
};
