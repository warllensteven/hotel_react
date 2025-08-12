import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ModalInicio from './ModalInicio';
import ModalRegistro from './ModalRegistro';

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('email'));

  const handleOpenRegistro = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const handleLogout = () => {
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('usuario');
    setIsAuthenticated(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleRegisterSuccess = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!sessionStorage.getItem('email'));
    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50">
        <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <img
                className="h-8 w-auto"
                src={`${import.meta.env.BASE_URL}imgs/nubes.svg`}
                alt="Logo Hotel"
              />
            </Link>
            <h2 className="ml-2 text-sm font-semibold text-gray-900">
              HOTEL EL RINCON DE XIMENA
            </h2>
          </div>

          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setIsMenuOpen(true)}
            >
              <span className="sr-only">Abrir menú</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                stroke="currentColor" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            <Link to="/" className="text-sm font-semibold text-gray-900">Inicio</Link>
            <a href="#cont-servicios" className="text-sm font-semibold text-gray-900">Servicios</a>
            <Link to="/reservas" className="text-sm font-semibold text-gray-900">Reservas</Link>
            <Link to="/informacion" className="text-sm font-semibold text-gray-900">Sobre nosotros</Link>
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-6">
            {isAuthenticated ? (
              <button
                className="text-sm font-semibold text-white bg-violet-600"
                onClick={handleLogout}
              >
                Cerrar sesión
              </button>
            ) : (
              <>
                <button
                  className="text-sm font-semibold text-white bg-violet-600"
                  onClick={() => setIsRegisterOpen(true)}
                >
                  Registrarse
                </button>
                <button
                  className="text-sm font-semibold text-white bg-violet-600"
                  onClick={() => setIsLoginOpen(true)}
                >
                  Iniciar sesión
                </button>
              </>
            )}
          </div>
        </nav>

        {/* Menú móvil */}
        <div className={`lg:hidden ${isMenuOpen ? '' : 'hidden'}`} role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-50"></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <Link to="/" className="-m-1.5 p-1.5" onClick={() => setIsMenuOpen(false)}>
                <img
                  className="h-8 w-auto"
                  src={`${import.meta.env.BASE_URL}imgs/nubes.svg`}
                  alt="Logo Hotel"
                />
              </Link>
              <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700"
                onClick={() => setIsMenuOpen(false)}>
                <span className="sr-only">Cerrar menú</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                  stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round"
                    d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <Link to="/" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                    Inicio
                  </Link>
                  <a href="#cont-servicios" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                    Servicios
                  </a>
                  <Link to="/reservas" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                    Reservas
                  </Link>
                  <Link to="/informacion" className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-gray-900 hover:bg-gray-50" onClick={() => setIsMenuOpen(false)}>
                    Sobre nosotros
                  </Link>
                </div>

                <div className="py-6">
                  {isAuthenticated ? (
                    <button className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                      onClick={() => { handleLogout(); setIsMenuOpen(false); }}>
                      Cerrar sesión
                    </button>
                  ) : (
                    <>
                      <button className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                        onClick={() => { setIsMenuOpen(false); setIsRegisterOpen(true); }}>
                        Registrarse
                      </button>
                      <button className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold text-gray-900 hover:bg-gray-50"
                        onClick={() => { setIsMenuOpen(false); setIsLoginOpen(true); }}>
                        Iniciar sesión
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

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
    </>
  );
}

export default Header;
