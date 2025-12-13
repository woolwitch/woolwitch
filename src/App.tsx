import { useState } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Shop } from './pages/Shop';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { Admin } from './pages/Admin';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import Orders from './pages/Orders';
import type { PageType, CartPageType } from './types/navigation';

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('shop');

  const renderPage = () => {
    const handleCartNavigation = (page: CartPageType) => {
      setCurrentPage(page);
    };

    const handleCheckoutNavigation = (page: CartPageType) => {
      setCurrentPage(page);
    };

    switch (currentPage) {
      case 'shop':
        return <Shop />;
      case 'cart':
        return <Cart onNavigate={handleCartNavigation} />;
      case 'checkout':
        return <Checkout onNavigate={handleCheckoutNavigation} />;
      case 'admin':
        return <Admin />;
      case 'orders':
        return <Orders />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      case 'privacy-policy':
        return <PrivacyPolicy onNavigate={setCurrentPage} />;
      case 'terms-of-service':
        return <TermsOfService onNavigate={setCurrentPage} />;
      default:
        return <Shop />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header currentPage={currentPage} onNavigate={setCurrentPage} />
      {renderPage()}
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
}

export default App;
