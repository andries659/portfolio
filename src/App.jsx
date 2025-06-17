import React from 'react';
import Portfolio from './components/Portfolio';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white pt-28">
      <header className="text-center py-10">
        <h1 className="text-4xl font-bold">.angel_xd.'s Project Portfolio</h1>
        <p className="text-gray-600 dark:text-gray-400">
          I am a person who loves coding. My hopes are to know most of the coding languages so I can build complex things, such as Among Us mods.<br />
          This website was built with React, TailwindCSS & Vite
        </p>
      </header>

      {/* Padding added here */}
      <main className="px-4 pt-20 pb-10">
        <Portfolio />
      </main>
    </div>
  );
}

export default App;
