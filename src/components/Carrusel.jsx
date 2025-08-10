import { useState, useEffect } from 'react';

function Carrusel() {
  const [contCarrusel, setContCarrusel] = useState(0);
  const imgsCarrusel = [
    'carrusel-1.png',
    'carrusel-2.png',
    'carrusel-3.png',
    'carrusel-4.png',
    'carrusel-5.png',
  ];
  const imgsCarruselMobile = [
    'carrusel-mv-1.png',
    'carrusel-mv-2.png',
    'carrusel-mv-3.png',
    'carrusel-mv-4.png',
    'carrusel-mv-5.png',
  ];
  const [currentImgsCarrusel, setCurrentImgsCarrusel] = useState(
    window.innerWidth <= 768 ? imgsCarruselMobile : imgsCarrusel
  );

  useEffect(() => {
    const handleResize = () => {
      setCurrentImgsCarrusel(window.innerWidth <= 768 ? imgsCarruselMobile : imgsCarrusel);
      setContCarrusel(0);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleNext = () => {
    setContCarrusel((prev) => (prev + 1) % currentImgsCarrusel.length);
  };

  const handlePrev = () => {
    setContCarrusel((prev) => (prev - 1 + currentImgsCarrusel.length) % currentImgsCarrusel.length);
  };

  return (
    <section id="cont-carrusel" className="py-12 sm:py-12 lg:py-12">
      <div className="relative mx-auto max-w-7xl h-64 sm:h-96">
        <img
          src="/imgs/arrow-left.svg"
          alt="Izquierda"
          className="absolute top-1/2 left-4 transform -translate-y-1/2 h-8 w-8 cursor-pointer z-10"
          onClick={handlePrev}
        />
        <img
          src={`/imgs/${currentImgsCarrusel[contCarrusel]}`}
          alt="Imagen carrusel hotel"
          className="w-full h-full object-cover rounded-lg"
        />
        <img
          src="/imgs/arrow-right.svg"
          alt="Derecha"
          className="absolute top-1/2 right-4 transform -translate-y-1/2 h-8 w-8 cursor-pointer z-10"
          onClick={handleNext}
        />
      </div>
    </section>
  );
}

export default Carrusel;