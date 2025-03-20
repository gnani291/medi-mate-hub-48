
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const NavItem = ({ to, children }: { to: string; children: React.ReactNode }) => (
    <Link
      to={to}
      className={cn(
        "px-4 py-2 rounded-md transition-all duration-200 font-medium",
        isActive(to)
          ? "bg-medimate-blue text-white"
          : "hover:bg-medimate-gray-dark"
      )}
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/75 border-b border-gray-200">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="relative w-8 h-8 bg-medimate-blue rounded-md flex items-center justify-center">
            <span className="text-white font-bold">M</span>
          </div>
          <span className="font-bold text-xl">MediMate</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          <NavItem to="/">Home</NavItem>
          <NavItem to="/patient/login">Patient</NavItem>
          <NavItem to="/owner/login">Owner</NavItem>
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 animate-fade-in">
          <nav className="flex flex-col items-center py-8 space-y-4">
            <NavItem to="/">Home</NavItem>
            <NavItem to="/patient/login">Patient</NavItem>
            <NavItem to="/owner/login">Owner</NavItem>
          </nav>
        </div>
      )}
    </header>
  );
};

export default NavBar;
