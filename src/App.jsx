import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Carrusel from './components/Carrusel';
import WhatsAppButton from './components/WhatsAppButton';
import Habitaciones from './components/Habitaciones';
import Servicios from './components/Servicios';
import Reservas from './components/Reservas';
import Informacion from './components/Informacion';

function App() {
  return (
    <Router>
      <div className="relative">
        <Header />
        <main className="px-4">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Carrusel />
                  <Hero />
                  <Habitaciones />
                  <Servicios />
                </>
              }
            />
            <Route path="/reservas" element={<Reservas />} />
            <Route path="/informacion" element={<Informacion />} />
          </Routes>
        </main>
        <Footer />
        <WhatsAppButton />
      </div>
    </Router>
  );
}

export default App;