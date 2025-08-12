import { useState } from 'react';
import { API } from '../utils/api';

function MisReservas({ onOpenInicio }) {
  const [reservasVisible, setReservasVisible] = useState(false);
  const [reservasUsuario, setReservasUsuario] = useState([]);
  const [error, setError] = useState('');

  const mostrarOcultarReservas = async () => {
    const usuarioCorreo = sessionStorage.getItem('email');
    if (!usuarioCorreo) {
      onOpenInicio();
      return;
    }

    if (!reservasVisible) {
      try {
        const [usuariosResponse, habitacionesResponse] = await Promise.all([
          fetch(`${API}/usuarios`),
          fetch(`${API}/habitaciones`),
        ]);
        if (!usuariosResponse.ok || !habitacionesResponse.ok) {
          throw new Error('Error al cargar datos');
        }
        const usuarios = await usuariosResponse.json();
        const habitacionesData = await habitacionesResponse.json();
        const usuario = usuarios.find((u) => u.correo === usuarioCorreo);

        if (usuario && usuario.reservas && usuario.reservas.length > 0) {
          const reservasConDetalles = usuario.reservas.map((reserva) => {
            const habitacion = habitacionesData.find((h) => h.id === reserva.habitacion_id);
            return { ...reserva, habitacion };
          });
          setReservasUsuario(reservasConDetalles);
        } else {
          setReservasUsuario([]);
        }
      } catch (error) {
        setError('Error al cargar tus reservas: ' + error.message);
      }
      setReservasVisible(true);
    } else {
      setReservasVisible(false);
      setReservasUsuario([]);
      setError('');
    }
  };

  const cancelarReserva = async (habitacionId, fechaEntrada, fechaSalida) => {
    if (!confirm(`¿Estás seguro de cancelar la reserva para la habitación ${habitacionId} del ${fechaEntrada} al ${fechaSalida}?`)) {
      return;
    }

    try {
      const usuarioCorreo = sessionStorage.getItem('email');
      const usuariosResponse = await fetch(`${API}/usuarios`);
      if (!usuariosResponse.ok) throw new Error('Error al obtener usuarios');
      const usuarios = await usuariosResponse.json();
      const usuario = usuarios.find((u) => u.correo === usuarioCorreo);

      if (!usuario) {
        setError('Usuario no encontrado');
        return;
      }

      const nuevasReservas = usuario.reservas.filter(
        (r) =>
          !(
            r.habitacion_id === parseInt(habitacionId) &&
            r.fecha_entrada === fechaEntrada &&
            r.fecha_salida === fechaSalida
          )
      );

      const response = await fetch(`${API}/usuarios/${usuario.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservas: nuevasReservas }),
      });

      if (response.ok) {
        const habitacionesResponse = await fetch(`${API}/habitaciones`);
        if (!habitacionesResponse.ok) throw new Error('Error al obtener habitaciones');
        const habitacionesData = await habitacionesResponse.json();
        const reservasConDetalles = nuevasReservas.map((reserva) => {
          const habitacion = habitacionesData.find((h) => h.id === reserva.habitacion_id);
          return { ...reserva, habitacion };
        });
        setReservasUsuario(reservasConDetalles);
        if (nuevasReservas.length === 0) {
          setReservasVisible(false);
        }
      } else {
        const data = await response.json();
        setError(`Error al cancelar la reserva: ${data.message || 'Inténtalo de nuevo'}`);
      }
    } catch (error) {
      setError('Error al conectar con el servidor: ' + error.message);
    }
  };

  return (
    <div className="px-8">
      <button
        onClick={mostrarOcultarReservas}
        className="bg-violet-600 text-white font-semibold rounded-lg px-6 py-2 hover:bg-violet-400 transition-colors duration-300"
      >
        {reservasVisible ? 'Ocultar Reservas' : 'Mis Reservas'}
      </button>
      <div className="mt-4">
        {reservasVisible && (
          <div className="flex flex-row space-x-6 overflow-x-auto pb-4">
            {error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : reservasUsuario.length > 0 ? (
              reservasUsuario.map((reserva, index) => (
                <div
                  key={`${reserva.habitacion_id}-${reserva.fecha_entrada}-${index}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:scale-105 transition-transform duration-300 min-w-[300px]"
                >
                  <img
                    src={reserva.habitacion?.img}
                    alt={reserva.habitacion?.tipo}
                    className="w-full h-48 object-cover img-habitacion"
                  />
                  <div className="p-4">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {reserva.habitacion?.tipo}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {reserva.habitacion?.descripcion || 'Sin descripción'}
                    </p>
                    <ul className="text-sm text-gray-500">
                      <li>✔ Wi-Fi</li>
                      <li>✔ TV</li>
                      <li>✔ Baño privado</li>
                    </ul>
                    <h3 className="text-xl font-bold text-green-800 mb-2 my-2">
                      {reserva.habitacion?.precio}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Fecha de entrada: <span className="font-bold">{reserva.fecha_entrada}</span>
                    </p>
                    <p className="text-gray-600 text-sm">
                      Fecha de salida: <span className="font-bold">{reserva.fecha_salida}</span>
                    </p>
                  </div>
                  <div className="p-3 flex justify-center">
                    <button
                      className="bg-violet-600 text-white font-semibold rounded px-4 py-2 hover:bg-violet-400 transition-colors duration-300"
                      onClick={() =>
                        cancelarReserva(
                          reserva.habitacion_id,
                          reserva.fecha_entrada,
                          reserva.fecha_salida
                        )
                      }
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600">No tienes reservas.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MisReservas;