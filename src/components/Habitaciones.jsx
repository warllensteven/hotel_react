import { useState, useEffect } from 'react';
import ModalReserva from './ModalReserva';
import ModalInicio from './ModalInicio';
import ModalRegistro from './ModalRegistro';
import { API } from '../utils/api';

function Habitaciones() {
  const [habitaciones, setHabitaciones] = useState([]);
  const [error, setError] = useState(null);
  const [isReservaOpen, setIsReservaOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [selectedHabitacionId, setSelectedHabitacionId] = useState(null);

  useEffect(() => {
    const fetchHabitaciones = async () => {
      try {
        const response = await fetch(`${API}/habitaciones`);
        if (!response.ok) throw new Error('Error al cargar habitaciones');
        const data = await response.json();
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

  const handleReservar = (habitacionId) => {
    if (!sessionStorage.getItem('email')) {
      setIsLoginOpen(true);
      return;
    }
    setSelectedHabitacionId(habitacionId);
    setIsReservaOpen(true);
  };

  return (
    <>
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
                    className="w-full h-48 object-cover img-habitacion"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {habitacion.tipo}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {habitacion.descripcion || 'Sin descripción'}
                    </p>
                    <ul className="text-sm text-gray-500">
                      <li>✔ Wi-Fi</li>
                      <li>✔ TV</li>
                      <li>✔ Baño privado</li>
                    </ul>
                    <h3 className="text-xl font-bold text-green-800 mb-2 my-2">
                      {habitacion.precio}
                    </h3>
                  </div>
                  <div className="p-3 flex justify-center">
                    <button
                      className={`${sessionStorage.getItem("email") ? "permitir-reservar" : "reservar"} bg-violet-500 text-white font-semibold rounded px-4 py-2 hover:bg-blue-600 transition-colors duration-300`}
                      onClick={() => handleReservar(habitacion.id)}
                    >
                      Reservar
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
      <ModalReserva
        isOpen={isReservaOpen}
        onClose={() => setIsReservaOpen(false)}
        habitacionId={selectedHabitacionId}
        onOpenInicio={() => setIsLoginOpen(true)}
      />
      <ModalInicio
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenRegistro={() => {
          setIsLoginOpen(false);
          setIsRegisterOpen(true);
        }}
      />
      <ModalRegistro
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
      />
    </>
  );
}

export default Habitaciones;