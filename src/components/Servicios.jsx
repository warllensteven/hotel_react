import { useState, useEffect } from 'react';

function Servicios() {
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServicios = async () => {
      try {
        const response = await fetch('https://servidor-j7p3.onrender.com/servicios');
        if (!response.ok) throw new Error('Error al cargar servicios');
        const data = await response.json();
        setServicios(data);
      } catch (error) {
        console.error('Error:', error);
        setError('No se pudieron cargar los servicios. Intenta de nuevo más tarde.');
        setServicios([]);
      }
    };
    fetchServicios();
  }, []);

  return (
    <section className="py-14 px-10 sm:py-32" id="cont-servicios">
      <div className="mx-auto px-2 lg:px-4">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl text-center">
          Servicios
        </h2>
        <p className="mt-4 text-lg text-gray-600 text-center">
          Disfruta de nuestras instalaciones y servicios diseñados para tu comodidad y
          entretenimiento.
        </p>
        {error && (
          <p className="text-center text-red-600 mt-4">{error}</p>
        )}
        <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-6">
          {servicios.length === 0 && !error ? (
            <p className="text-center text-gray-600">
              Cargando servicios...
            </p>
          ) : (
            servicios.map((servicio) => (
              <div
                key={servicio.id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300"
              >
                <img
                  src={servicio.img}
                  alt={servicio.descripcion}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <p className="text-xl font-bold text-gray-800 mb-2">
                    {servicio.descripcion}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default Servicios;