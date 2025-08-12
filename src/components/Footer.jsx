function Footer() {
  return (
    <footer className="bg-violet-600 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm font-semibold">
            © 2025 Hotel El Rincón de Ximena. Todos los derechos reservados
          </p>
          <ul className="flex space-x-4 mt-4 md:mt-0">
            <li>
              <a href="#" className="hover:underline font-semibold text-white">
                Política de privacidad
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline font-semibold text-white">
                Términos y condiciones
              </a>
            </li>
            <li>
              <a href="#" className="hover:underline font-semibold text-white">
                Contáctanos
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}

export default Footer;