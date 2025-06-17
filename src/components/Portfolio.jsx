import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll } from 'framer-motion';
import projects from '../projects.json';

export default function Portfolio() {
  const { scrollYProgress } = useScroll();

  const [search, setSearch] = useState('');
  const [clickCount, setClickCount] = useState(0);
  const [retroActive, setRetroActive] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [darkMode, setDarkMode] = useState(() =>
    localStorage.getItem('theme') === 'dark' ||
    (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
  const audioRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (clickCount >= 5) {
      document.documentElement.classList.toggle('retro');
      setRetroActive(!retroActive);
      setClickCount(0);

      setShowToast(true);
      if (audioRef.current) audioRef.current.play();
      setTimeout(() => setShowToast(false), 3000);
    }
  }, [clickCount]);

  const filteredProjects = projects.filter((project) => {
    const searchText = search.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchText) ||
      project.description.toLowerCase().includes(searchText) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchText))
    );
  });

  const getLinkLabel = (type) => {
    switch (type) {
      case 'bot':
        return 'Invite Bot';
      case 'website':
        return 'Website';
      case 'mod':
        return 'View Mod';
      default:
        return 'View Project';
    }
  };

  return (
    <>
      {/* Scroll Progress */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Navbar */}
      <nav className="w-full fixed top-0 z-40 flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-900 shadow border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-800 dark:text-white">My Portfolio</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-white px-3 py-1.5 rounded-full transition hover:scale-105"
        >
          {darkMode ? '🌞 Light Mode' : '🌙 Dark Mode'}
        </button>
      </nav>

      {/* Toast */}
      {showToast && (
        <div className="fixed top-16 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black px-6 py-3 rounded-xl shadow-lg z-50 font-mono text-sm">
          🕹️ Retro Mode {retroActive ? 'Activated' : 'Deactivated'}!
        </div>
      )}

      {/* Retro Sound */}
      <audio ref={audioRef} src="/retro-sound.wav" preload="auto" />

      {/* Main Content */}
      <div className="pt-20">
        {/* Profile Section */}
        <div className="flex justify-center items-center gap-4 mb-4">
          <img
            src="/images/download.jpeg"
            alt="Profile"
            onClick={() => setClickCount((prev) => prev + 1)}
            className="w-24 h-24 object-cover rounded-full cursor-pointer transition-transform hover:scale-110 border-4 border-blue-400 dark:border-blue-600"
          />
          <div className="text-center text-xl font-semibold text-gray-800 dark:text-white">
            Welcome to My Portfolio
            <p className="text-sm text-gray-500 dark:text-gray-400">
              The avatar to the left is my Discord avatar. Feel free to reach out to me in Discord any time.<br />
              I've also added a special easter egg, if you find it, you're lucky, I can't even do it myself!
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-4 pb-4">
          <input
            type="text"
            placeholder="Search projects..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full p-3 text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 pb-10">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4"
            >
              <img
                src={project.image}
                alt={project.title}
                className="rounded-lg w-full h-40 object-cover mb-4"
              />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">{project.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">{project.description}</p>
              <div className="flex flex-wrap gap-2 mb-3">
                {project.tags.map((tag, tagIndex) => (
                  <span
                    key={tagIndex}
                    className="bg-blue-100 text-blue-800 text-sm font-medium px-2 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex gap-4">
                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {getLinkLabel(project.type)}
                  </a>
                )}
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-black dark:hover:text-white"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </>
  );
}
