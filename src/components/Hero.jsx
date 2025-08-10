function Hero() {
  return (
    <section className="mx-auto max-w-2xl py-8 sm:py-12 lg:py-16">
      <div className="text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
          Confort, calidad y comodidad en un solo lugar, ¡elígenos!
        </h1>
        <p className="mt-6 text-lg text-gray-600">
          Somos un hotel con gran posicionamiento y trayectoria que presta de la
          mejor manera su atención y servicio para sus clientes.
        </p>
        <div className="mt-8 flex items-center justify-center gap-x-6">
          <a
            href="#"
            className="rounded-md bg-violet-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-violet-500"
          >
            Más información
          </a>
        </div>
      </div>
    </section>
  );
}

export default Hero;