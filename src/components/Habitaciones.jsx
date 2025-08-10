import { useState, useEffect } from 'react';

function Habitaciones() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        const response = await fetch('https://servidor-j7p3.onrender.com/habitaciones');
        if (!response.ok) throw new Error('Error al cargar habitaciones');
        const data = await response.json();
        // Filtrar habitaciones únicas por tipo, tomando la de menor ID
        const tiposUnicos = [...new Set(data.map((h) => h.tipo))];
        const habitacionesUnicas = tiposUnicos.map((tipo) =>
          data.find(
            (h) =>
              h.tipo === tipo &&
              h.id === Math.min(...data.filter((h) => h.tipo === tipo).map((h) => h.id))
          )
        );
        setHabitaciones(habitacionesUnicas);
      } catch (error) {
        console.error('Error:', error);
        setError('No se pudieron cargar las habitaciones. Intenta de nuevo más tarde.');
        setHabitaciones([]);
      }
    };
    fetchHabitaciones();
  }, []);

  return (
    <section className="py-14 px-10 sm:py-32" id="habitaciones">
      <div className="mx-auto px-2 lg:px-4">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl text-center">
          Habitaciones
        </h2>
        <p className="mt-4 text-lg text-gray-600">
          Bienvenido a Hotel El Rincón De XIMENA, Contamos con gran variedad de
          habitaciones con la mayor calidad, comodidad, confort y limpieza de la
          zona, contamos con espacios diversos, como spa, piscina, salón social,
          restaurante y canchas de esparcimiento. Además ofrecemos un excelente
          servicio que te hará sentir como en casa, aquí están las diversas
          opciones de habitaciones que traemos para ti, ¡adelante!
        </p>
        {error && (
          <p className="text-center text-red-600 mt-4">{error}</p>
        )}
        <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-6">
          {habitaciones.length === 0 && !error ? (
            <p className="text-center text-gray-600">
              Cargando habitaciones...
            </p>
          ) : (
            habitaciones.map((habitacion) => (
              <div
                key={habitacion.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={habitacion.img}
                  alt={habitacion.tipo}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {habitacion.tipo}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {habitacion.descripcion || 'Sin descripción'}
                  </p>
                  <ul className="text-sm text-gray-500 mb-4">
                    <li>✔ Wi-Fi</li>
                    <li>✔ TV</li>
                    <li>✔ Baño privado</li>
                    <li>✔ Capacidad: {habitacion.capacidad} persona(s)</li>
                  </ul>
                  <p className="text-green-500 text-lg font-semibold mb-4">
                    {habitacion.precio} por noche
                  </p>
                  <button className="w-full bg-violet-500 text-white font-semibold rounded px-4 py-2 hover:bg-violet-600">
                    Reservar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Habitaciones;