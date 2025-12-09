import { useState } from 'react';
import { Header } from './components/Header';
import { Shop } from './pages/Shop';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Admin } from './pages/Admin';
import { About } from './pages/About';
import { Contact } from './pages/Contact';

function App() {
  const [currentPage, setCurrentPage] = useState<'shop' | 'cart' | 'checkout' | 'admin' | 'about' | 'contact'>('shop');

  const renderPage = () => {
    switch (currentPage) {
      case 'shop':
        return <Shop />;
      case 'cart':
        return <Cart onNavigate={setCurrentPage} />;
      case 'checkout':
        return <Checkout onNavigate={setCurrentPage} />;
      case 'admin':
        return <Admin />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return <Shop />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
      {currentPage === 'shop' && (
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-lg mb-2">Made with love and care</p>
            <p className="text-gray-400">© 2024 Woolwitch. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;
