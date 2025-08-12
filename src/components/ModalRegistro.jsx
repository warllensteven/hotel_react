import { useState } from 'react';
import { API } from '../utils/api';

function ModalRegistro({ isOpen, onClose, onRegisterSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    const usuario = {
      correo: email,
      contraseña: password,
      reservas: [],
    };

    try {
      const response = await fetch(`${API}/usuarios`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
      });
      if (response.ok) {
        const newUser = await response.json();
        sessionStorage.setItem('email', email);
        sessionStorage.setItem('usuario', JSON.stringify(newUser));
        setError('');
        console.log('Registro exitoso, cerrando modal...');
        if (typeof onRegisterSuccess === 'function') {
          onRegisterSuccess(); // Llamar solo si es una función
        }
        onClose();
      } else {
        throw new Error('Error al registrar usuario');
      }
    } catch (error) {
      setError('Error al registrar: ' + error.message);
      console.error('Error en registro:', error);
    }
  };

  return (
    <div
      className={`fixed inset-0 bg-black/50 z-50 flex justify-center items-center transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
    >
      <div className="modal-content bg-white rounded-xl p-8 w-full max-w-md relative z-60">
        <span
          className="absolute top-2 right-3 text-2xl cursor-pointer text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          ×
        </span>
        <div className="text-center">
          <img
            src={`${import.meta.env.BASE_URL}imgs/nubes.svg`}
            alt="Logo Hotel"
            className="w-20 mx-auto mb-3"
          />
          <h2 className="text-sm font-semibold text-gray-700 uppercase">
            Hotel El Rincón de Ximena
          </h2>
        </div>
        <h2 className="text-xl font-bold mt-4 mb-2">Regístrate con tu cuenta</h2>
        <form className="space-y-4 flex flex-col" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="emailRegistro" className="block text-sm font-medium text-gray-700">
              Correo electrónico
            </label>
            <input
              type="email"
              id="emailRegistro"
              placeholder="Correo electrónico"
              className="w-full border border-gray-300 p-2 rounded-md bg-white text-gray-700 [color-scheme:light]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="passwordRegistro" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <input
              type="password"
              id="passwordRegistro"
              placeholder="Contraseña"
              className="w-full border border-gray-300 p-2 rounded-md bg-white text-gray-700 [color-scheme:light]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-violet-600 text-white rounded-md font-bold hover:bg-violet-700 transition"
          >
            Registrarse
          </button>
        </form>
        {error && <p className="text-center text-red-500 mt-3 text-sm">{error}</p>}
      </div>
    </div>
  );
}

export default ModalRegistro;