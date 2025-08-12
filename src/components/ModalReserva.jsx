import { useState, useEffect } from 'react';
import { API } from '../utils/api';

function ModalReserva({ isOpen, onClose, habitacionId, onOpenInicio }) {
  const [habitacion, setHabitacion] = useState(null);
  const [cantPersonas, setCantPersonas] = useState('');
  const [llegada, setLlegada] = useState('');
  const [salida, setSalida] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (habitacionId) {
      fetch(`${API}/habitaciones`)
        .then((response) => {
          if (!response.ok) throw new Error('Error al cargar habitación');
          return response.json();
        })
        .then((data) => {
          const found = data.find((h) => h.id === habitacionId);
          setHabitacion(found || null);
        })
        .catch((error) => {
          setError('Error cargando habitación: ' + error.message);
          setHabitacion(null);
        });
    }
  }, [habitacionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sessionStorage.getItem('email')) {
      onOpenInicio();
      return;
    }
    if (!cantPersonas || !llegada || !salida) {
      setError('Por favor completa todos los campos.');
      return;
    }
    if (new Date(llegada) >= new Date(salida)) {
      setError('La fecha de entrada debe ser anterior a la de salida.');
      return;
    }
    if (habitacion && parseInt(cantPersonas) > habitacion.capacidad) {
      setError(`La capacidad máxima es ${habitacion.capacidad} personas.`);
      return;
    }

    try {
      const [usuariosResponse, habitacionesResponse] = await Promise.all([
        fetch(`${API}/usuarios`),
        fetch(`${API}/habitaciones`),
      ]);
      if (!usuariosResponse.ok || !habitacionesResponse.ok) {
        throw new Error('Error al obtener datos del servidor');
      }
      const usuarios = await usuariosResponse.json();
      const habitaciones = await habitacionesResponse.json();
      const usuario = usuarios.find((u) => u.correo === sessionStorage.getItem('email'));
      const habitacionDisponible = habitaciones.find(
        (h) =>
          h.tipo === habitacion?.tipo &&
          h.disponible &&
          h.capacidad >= parseInt(cantPersonas) &&
          !h.fechas_ocupadas?.some(
            (f) =>
              (llegada >= f.fecha_entrada && llegada <= f.fecha_salida) ||
              (salida >= f.fecha_entrada && salida <= f.fecha_salida) ||
              (llegada <= f.fecha_entrada && salida >= f.fecha_salida)
          )
      );

      if (!habitacionDisponible) {
        setError('No hay habitaciones disponibles para las fechas o capacidad seleccionadas.');
        return;
      }
      if (!usuario) {
        setError('Usuario no encontrado.');
        return;
      }

      const nuevasReservas = usuario.reservas ? [...usuario.reservas] : [];
      nuevasReservas.push({
        habitacion_id: habitacionDisponible.id,
        fecha_entrada: llegada,
        fecha_salida: salida,
      });

      habitacionDisponible.disponible = false;
      habitacionDisponible.fechas_ocupadas = habitacionDisponible.fechas_ocupadas || [];
      habitacionDisponible.fechas_ocupadas.push({
        fecha_entrada: llegada,
        fecha_salida: salida,
      });

      await Promise.all([
        fetch(`${API}/usuarios/${usuario.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...usuario, reservas: nuevasReservas }),
        }),
        fetch(`${API}/habitaciones/${habitacionDisponible.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(habitacionDisponible),
        }),
      ]);

      alert('¡Reserva confirmada!');
      setError('');
      onClose();
    } catch (error) {
      setError('Error al realizar la reserva: ' + error.message);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex justify-center items-center transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-white rounded-lg max-w-lg w-full p-6 relative">
        <span
          className="absolute top-2 right-2 text-xl font-bold text-gray-500 cursor-pointer"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ×
        </span>
        {habitacion ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">
              {habitacion.tipo}
            </h2>
            <p className="text-gray-600 mb-3">{habitacion.descripcion}</p>
            <p className="text-violet-600 font-semibold text-sm mb-2">
              Máx. Personas: {habitacion.capacidad}
            </p>
            <p className="text-green-500 text-lg font-semibold mb-4">
              {habitacion.precio} por noche
            </p>
            <p className="text-gray-600 mb-3">Check in entrada: 5:00 pm</p>
            <p className="text-gray-600 mb-3">Check in salida: 2:00 pm</p>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="cantPersonas" className="block text-gray-700">
                  Número de personas:
                </label>
                <input
                  type="number"
                  id="cantPersonas"
                  className="w-full border border-gray-300 p-2 rounded-md bg-white text-gray-700 [color-scheme:light]"
                  required
                  min="1"
                  value={cantPersonas}
                  onChange={(e) => setCantPersonas(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="llegada" className="block text-gray-700">
                  Fecha de inicio:
                </label>
                <input
                  type="date"
                  id="llegada"
                  className="w-full border border-gray-300 p-2 rounded-md bg-white text-gray-700 [color-scheme:light]"
                  required
                  value={llegada}
                  onChange={(e) => setLlegada(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="salida" className="block text-gray-700">
                  Fecha de salida:
                </label>
                <input
                  type="date"
                  id="salida"
                  className="w-full border border-gray-300 p-2 rounded-md bg-white text-gray-700 [color-scheme:light]"
                  required
                  value={salida}
                  onChange={(e) => setSalida(e.target.value)}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-400"
              >
                Confirmar Reserva
              </button>
            </form>
            {error && <p className="text-red-500 text-center mt-3">{error}</p>}
          </>
        ) : (
          <p className="text-red-500 text-center">
            {error || 'Habitación no disponible.'}
          </p>
        )}
      </div>
    </div>
  );
}

export default ModalReserva;