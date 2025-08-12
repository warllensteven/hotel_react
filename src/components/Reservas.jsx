import { useState } from 'react';
import { API } from '../utils/api';
import ModalInicio from './ModalInicio';
import ModalRegistro from './ModalRegistro';
import ModalReserva from './ModalReserva';
import MisReservas from './MisReservas';

function Reservas() {
  const [cantPersonas, setCantPersonas] = useState('');
  const [llegada, setLlegada] = useState('');
  const [salida, setSalida] = useState('');
  const [error, setError] = useState('');
  const [habitaciones, setHabitaciones] = useState([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isReservaOpen, setIsReservaOpen] = useState(false);
  const [selectedHabitacionId, setSelectedHabitacionId] = useState(null);

  const handleOpenRegistro = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleLoginSuccess = () => {
    setIsLoginOpen(false);
  };

  const handleRegisterSuccess = () => {
    setIsRegisterOpen(false);
  };

  const filtrarHabitaciones = async (e) => {
    if (e) e.preventDefault();
    const parsedCantPersonas = parseInt(cantPersonas);
    if (
      !parsedCantPersonas ||
      isNaN(parsedCantPersonas) ||
      parsedCantPersonas <= 0 ||
      !llegada ||
      !salida ||
      new Date(llegada) > new Date(salida)
    ) {
      setError(
        'Ingresa un número válido de personas (> 0) y fechas correctas (llegada no posterior a salida).'
      );
      return;
    }

    try {
      const response = await fetch(`${API}/habitaciones`);
      if (!response.ok) throw new Error(`Error en la solicitud a la API: ${response.status}`);
      const data = await response.json();
      const habitacionesFiltradas = [];
      for (let i = 0; i < data.length; i++) {
        const habitacion = data[i];
        let capacidadOk = habitacion.capacidad >= parsedCantPersonas;
        let fechasOk = true;

        if (habitacion.fechas_ocupadas && habitacion.fechas_ocupadas.length > 0) {
          for (let j = 0; j < habitacion.fechas_ocupadas.length; j++) {
            const fechaInicio = new Date(habitacion.fechas_ocupadas[j].fecha_entrada);
            const fechaFin = new Date(habitacion.fechas_ocupadas[j].fecha_salida);
            const fechaLlegada = new Date(llegada);
            const fechaSalida = new Date(salida);

            if (
              (fechaLlegada >= fechaInicio && fechaLlegada <= fechaFin) ||
              (fechaSalida >= fechaInicio && fechaSalida <= fechaFin) ||
              (fechaLlegada <= fechaInicio && fechaSalida >= fechaFin)
            ) {
              fechasOk = false;
              break;
            }
          }
        }

        if (capacidadOk && fechasOk && habitacion.disponible) {
          habitacionesFiltradas.push(habitacion);
        }
      }

      const habitacionesPorTipo = {};
      for (let i = 0; i < habitacionesFiltradas.length; i++) {
        const habitacion = habitacionesFiltradas[i];
        if (!habitacionesPorTipo[habitacion.tipo]) {
          habitacionesPorTipo[habitacion.tipo] = habitacion;
        }
      }
      const habitacionesUnicasPorTipo = Object.values(habitacionesPorTipo);

      setHabitaciones(habitacionesUnicasPorTipo);
      setError('');
    } catch (error) {
      console.error('Error al filtrar habitaciones:', error);
      setError('Hubo un problema al buscar habitaciones.');
      setHabitaciones([]);
    }
  };

  const handleReservar = (habitacionId) => {
    if (!sessionStorage.getItem('email')) {
      setIsLoginOpen(true);
      return;
    }
    setSelectedHabitacionId(habitacionId);
    setIsReservaOpen(true);
  };

  return (
    <div className="sm:pt-32 px-2 cont-formu-reservar pb-6">
      <section className="sm:pt-16 px-8 pb-6">
        <div className="mx-auto px-2 lg:px-4 cont-reservar bg-violet-600">
          <form
            className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-1 lg:grid-cols-3 lg:gap-x-6"
            onSubmit={filtrarHabitaciones}
          >
            <div className="flex flex-row justify-center lg:px-8">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="cantPersonas"
                  className="block text-sm font-semibold text-white px-2"
                >
                  N. personas:
                </label>
              </div>
              <div className="mt-2">
                <input
                  type="number"
                  name="cantPersonas"
                  id="cantPersonas"
                  required
                  className="w-full border border-gray-300 p-2 rounded-md bg-white text-gray-700 [color-scheme:light]"
                  value={cantPersonas}
                  onChange={(e) => setCantPersonas(e.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-row justify-center lg:px-8">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="llegada"
                  className="block text-sm text-white px-2 font-semibold"
                >
                  Llegada:
                </label>
              </div>
              <div className="mt-2">
                <input
                  type="date"
                  name="llegada"
                  id="llegada"
                  required
                  className="w-full border border-gray-300 p-2 rounded-md bg-white text-gray-700 [color-scheme:light]"
                  value={llegada}
                  onChange={(e) => setLlegada(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            <div className="flex flex-row justify-center lg:px-8">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="salida"
                  className="block text-sm text-white font-semibold"
                >
                  Salida:
                </label>
              </div>
              <div className="mt-2">
                <input
                  type="date"
                  name="salida"
                  id="salida"
                  required
                  className="w-full border border-gray-300 p-2 rounded-md bg-white text-gray-700 [color-scheme:light]"
                  value={salida}
                  onChange={(e) => setSalida(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>
            {error && (
              <div className="text-red-600 text-center col-span-full">{error}</div>
            )}
<button
  type="submit"
  className="col-span-full flex justify-center my-6 rounded-md bg-violet-400 px-3 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
>
  Buscar
</button>

          </form>
        </div>
      </section>
      <MisReservas onOpenInicio={() => setIsLoginOpen(true)} />
      <main className="relative isolate px-4 mt-0 lg:px-6">
        <div className="mt-12 grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-x-8 lg:grid-cols-3 lg:gap-x-6">
          {habitaciones.length === 0 && !error ? (
            <p className="">
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
                    className={`${
                      sessionStorage.getItem('email') ? 'permitir-reservar' : 'reservar'
                    } bg-violet-500 text-white font-semibold rounded px-4 py-2 hover:bg-blue-600 transition-colors duration-300`}
                    onClick={() => handleReservar(habitacion.id)}
                  >
                    Reservar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      <ModalInicio
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onOpenRegistro={handleOpenRegistro}
        onLoginSuccess={handleLoginSuccess}
      />
      <ModalRegistro
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        onRegisterSuccess={handleRegisterSuccess}
      />
      <ModalReserva
        isOpen={isReservaOpen}
        onClose={() => setIsReservaOpen(false)}
        habitacionId={selectedHabitacionId}
        onOpenInicio={() => setIsLoginOpen(true)}
      />
    </div>
  );
}

export default Reservas;