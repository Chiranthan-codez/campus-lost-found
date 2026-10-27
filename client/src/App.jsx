import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { useAuth } from './services/auth';
import Home from './pages/Home';
import Items from './pages/Items';
import ItemDetail from './pages/ItemDetail';
import ItemForm from './pages/ItemForm';
import MyReports from './pages/MyReports';
import Auth from './pages/Auth';

function Protected({ children }) {
  const { user, loading } = useAuth(), loc = useLocation();
  if (loading) return <p className="p-8">Loading…</p>;
  return user ? children : <Navigate to="/login" state={{ from: loc.pathname + loc.search }} replace />;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:m-2 focus:bg-white focus:p-2 focus:rounded-full">Skip to content</a>
      <Navbar />
      <main id="main" className="flex-1 mx-auto w-full max-w-6xl px-4 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/items" element={<Items />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/report" element={<Protected><ItemForm /></Protected>} />
          <Route path="/items/:id/edit" element={<Protected><ItemForm /></Protected>} />
          <Route path="/my-reports" element={<Protected><MyReports /></Protected>} />
          <Route path="/login" element={<Auth mode="login" />} />
          <Route path="/register" element={<Auth mode="register" />} />
          <Route path="*" element={<p>Page not found.</p>} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
