import { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaMoon, FaSun } from 'react-icons/fa';

const Navbar = ({ activeTab, setActiveTab, darkMode, toggleDarkMode }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
      }
    };

    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (isMobile) {
      setIsMenuOpen(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'py-1 shadow-xl' : 'py-3'} ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-indigo-600 to-purple-600'}`}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <span className={`text-xl font-bold ${darkMode ? 'text-purple-400' : 'text-white'} flex items-center`}>
              <span className="mr-2">🚀</span>TaskTrail
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => handleTabChange("Home")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "Home" 
                  ? `${darkMode ? 'bg-purple-800 text-white' : 'bg-white text-indigo-600'}`
                  : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-white hover:bg-white hover:bg-opacity-20'}`
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleTabChange("Your Tasks")}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === "Your Tasks" 
                  ? `${darkMode ? 'bg-purple-800 text-white' : 'bg-white text-indigo-600'}`
                  : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-white hover:bg-white hover:bg-opacity-20'}`
              }`}
            >
              Completed Tasks
            </button>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full ${darkMode ? 'text-yellow-300 hover:bg-gray-800' : 'text-white hover:bg-white hover:bg-opacity-20'}`}
            >
              {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleDarkMode}
              className={`p-2 mr-2 rounded-full ${darkMode ? 'text-yellow-300' : 'text-white'}`}
            >
              {darkMode ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`inline-flex items-center justify-center p-2 rounded-md ${
                darkMode ? 'text-gray-400 hover:text-white' : 'text-white hover:text-indigo-200'
              } hover:bg-opacity-20 focus:outline-none`}
            >
              {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      } ${darkMode ? 'bg-gray-800' : 'bg-indigo-700'}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <button
            onClick={() => handleTabChange("Home")}
            className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
              activeTab === "Home" 
                ? `${darkMode ? 'bg-purple-800 text-white' : 'bg-white text-indigo-600'}`
                : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-white hover:bg-white hover:bg-opacity-20'}`
            }`}
          >
            Home
          </button>
          <button
            onClick={() => handleTabChange("Your Tasks")}
            className={`block px-3 py-2 rounded-md text-base font-medium w-full text-left ${
              activeTab === "Your Tasks" 
                ? `${darkMode ? 'bg-purple-800 text-white' : 'bg-white text-indigo-600'}`
                : `${darkMode ? 'text-gray-300 hover:text-white' : 'text-white hover:bg-white hover:bg-opacity-20'}`
            }`}
          >
            Completed Tasks
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;