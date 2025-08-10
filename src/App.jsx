import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Carrusel from './components/Carrusel';
import WhatsAppButton from './components/WhatsAppButton';
import Habitaciones from './components/Habitaciones';
import Servicios from './components/Servicios';

function App() {
  return (
    <div className="relative">
      <Header />
      <main className="px-4 py-8">
        <Carrusel />
        <Hero />
        <Habitaciones />
        <Servicios />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

export default App;