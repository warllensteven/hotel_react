import { useState, useEffect } from 'react';
import { API } from '../utils/api';
import { filtrarHabitaciones } from '../utils/habitaciones';

function ModalReserva({ isOpen, onClose, habitacionId, onOpenInicio }) {
  const [habitacion, setHabitacion] = useState(null);
  const [cantPersonas, setCantPersonas] = useState(1);
  const [fechaEntrada, setFechaEntrada] = useState('');
  const [fechaSalida, setFechaSalida] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && habitacionId) {
      const fetchHabitacion = async () => {
        try {
          const response = await fetch(`${API}/habitaciones`);
          if (!response.ok) throw new Error('Error al cargar habitación');
          const data = await response.json();
          const selectedHabitacion = data.find((h) => h.id === habitacionId);
          setHabitacion(selectedHabitacion);
        } catch (error) {
          setError(error.message);
        }
      };
      fetchHabitacion();
    }
  }, [isOpen, habitacionId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!sessionStorage.getItem('email')) {
      onOpenInicio();
      return;
    }

    if (!cantPersonas || isNaN(cantPersonas) || !fechaEntrada || !fechaSalida) {
      setError('Por favor completa todos los campos correctamente.');
      return;
    }

    if (new Date(fechaEntrada) >= new Date(fechaSalida)) {
      setError('La fecha de entrada debe ser anterior a la de salida.');
      return;
    }

    try {
      const habitacionesFiltradas = await filtrarHabitaciones(cantPersonas, fechaEntrada, fechaSalida);
      const habitacionDisponible = habitacionesFiltradas.find(
        (h) => h.id === habitacionId && h.disponible && h.capacidad >= cantPersonas
      );

      if (!habitacionDisponible) {
        setError(
          `No hay habitaciones disponibles de tipo ${habitacion?.tipo} para ${cantPersonas} personas.`
        );
        return;
      }

      const [usuariosResponse, habitacionesResponse] = await Promise.all([
        fetch(`${API}/usuarios`),
        fetch(`${API}/habitaciones`),
      ]);

      if (!usuariosResponse.ok || !habitacionesResponse.ok) {
        throw new Error('Error al obtener los datos del servidor');
      }

      const usuarios = await usuariosResponse.json();
      const habitaciones = await habitacionesResponse.json();
      const usuario = usuarios.find((u) => u.correo === sessionStorage.getItem('email'));

      if (!usuario) {
        setError('Usuario no encontrado');
        return;
      }

      if (!usuario.reservas) usuario.reservas = [];
      usuario.reservas.push({
        habitacion_id: habitacionId,
        fecha_entrada: fechaEntrada,
        fecha_salida: fechaSalida,
      });

      const updatedHabitacion = habitaciones.find((h) => h.id === habitacionId);
      updatedHabitacion.disponible = false;
      if (!updatedHabitacion.fechas_ocupadas) updatedHabitacion.fechas_ocupadas = [];
      updatedHabitacion.fechas_ocupadas.push({
        fecha_entrada: fechaEntrada,
        fecha_salida: fechaSalida,
      });

      await Promise.all([
        fetch(`${API}/usuarios/${usuario.id}`, {
          method: 'PUT',
          body: JSON.stringify(usuario),
          headers: { 'Content-Type': 'application/json' },
        }),
        fetch(`${API}/habitaciones/${habitacionId}`, {
          method: 'PUT',
          body: JSON.stringify(updatedHabitacion),
          headers: { 'Content-Type': 'application/json' },
        }),
      ]);

      alert('¡Reserva confirmada!');
      onClose();
    } catch (error) {
      setError('Ocurrió un error al realizar la reserva. Inténtalo más tarde.');
      console.error('Error al realizar la reserva:', error);
    }
  };

  return (
    <div
      className={`modal fixed inset-0 bg-black/50 z-50 flex justify-center items-center ${isOpen ? '' : 'hidden'}`}
    >
      <div className="modal-content bg-white rounded-xl p-8 w-full max-w-md relative">
        <span
          className="absolute top-2 right-2 text-xl font-bold text-gray-500 cursor-pointer"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ×
        </span>
        {habitacion ? (
          <>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">{habitacion.tipo}</h2>
            <p className="text-gray-600 mb-3">{habitacion.descripcion}</p>
            <p className="text-orange-500 text-sm mb-2">Máx. Personas: {habitacion.capacidad}</p>
            <p className="text-green-500 text-lg font-semibold mb-4">{habitacion.precio} por noche</p>
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
                  className="w-full border border-gray-300 p-2 rounded-md"
                  value={cantPersonas}
                  onChange={(e) => setCantPersonas(parseInt(e.target.value))}
                  required
                  min="1"
                />
              </div>
              <div>
                <label htmlFor="llegada" className="block text-gray-700">
                  Fecha de inicio:
                </label>
                <input
                  type="date"
                  id="llegada"
                  className="w-full border border-gray-300 p-2 rounded-md"
                  value={fechaEntrada}
                  onChange={(e) => setFechaEntrada(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="salida" className="block text-gray-700">
                  Fecha de finalización:
                </label>
                <input
                  type="date"
                  id="salida"
                  className="w-full border border-gray-300 p-2 rounded-md"
                  value={fechaSalida}
                  onChange={(e) => setFechaSalida(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Confirmar Reserva
              </button>
            </form>
            {error && <p className="text-center text-red-500 mt-3 text-sm">{error}</p>}
          </>
        ) : (
          <p className="text-red-500">Habitación no disponible.</p>
        )}
      </div>
    </div>
  );
}

export default ModalReserva;