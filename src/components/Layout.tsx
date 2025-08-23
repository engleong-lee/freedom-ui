import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { BarChart3, LineChart, UserCircle, Menu, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100 transition-all duration-200 ${
          isActive ? 'bg-gray-100 border-r-4 border-blue-500' : ''
        }`
      }
      onClick={() => setIsMobileMenuOpen(false)}
    >
      <Icon className={`${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} size={20} />
      {isSidebarOpen && <span>{label}</span>}
    </NavLink>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Desktop Sidebar */}
      <div
        className={`hidden md:block bg-white shadow-md transition-all duration-300 ease-in-out ${
          isSidebarOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className="relative">
          {/* Header with Toggle Button */}
          <div className={`p-6 ${!isSidebarOpen && 'p-4'}`}>
            <div className="flex items-center justify-between">
              {isSidebarOpen && (
                <h1 className="text-xl font-bold">Trading Dashboard</h1>
              )}
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
              >
                {isSidebarOpen ? (
                  <ChevronLeft size={20} className="text-gray-600" />
                ) : (
                  <ChevronRight size={20} className="text-gray-600" />
                )}
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="mt-6">
            <NavItem to="/account" icon={UserCircle} label="Account" />
            <NavItem to="/positions" icon={BarChart3} label="Positions" />
            <NavItem to="/analysis" icon={LineChart} label="Analysis & Decision" />
          </nav>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Toggle menu"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`md:hidden fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-40 transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-6 mt-14">
          <h1 className="text-xl font-bold">Trading Dashboard</h1>
        </div>
        <nav className="mt-6">
          <NavItem to="/account" icon={UserCircle} label="Account" />
          <NavItem to="/positions" icon={BarChart3} label="Positions" />
          <NavItem to="/analysis" icon={LineChart} label="Analysis & Decision" />
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <main className={`p-6 flex-1 flex flex-col min-h-0 ${!isSidebarOpen ? 'md:ml-0' : ''} transition-all duration-300`}>
          {children}
        </main>
      </div>
    </div>
  );
}
