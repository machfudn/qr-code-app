import { useState, useEffect } from 'react';
import { IconSun, IconMoon } from '@/components/Icons';

function Theme() {
  //Tema handling
  const [darkMode, setDarkMode] = useState(() => {
    // Check local storage or system preference
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      if (savedMode !== null) {
        return savedMode === 'true';
      }
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference to local storage
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  return (
    <div>
      <button
        type='button'
        onClick={toggleDarkMode}
        className='p-2 rounded-md bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors'
        aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}>
        {darkMode ? <IconSun /> : <IconMoon />}
      </button>
    </div>
  );
}

export default Theme;
