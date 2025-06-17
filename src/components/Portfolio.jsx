import React, { useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import projects from '../projects.json';

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

export default function Portfolio() {
  const { scrollYProgress } = useScroll();
  const [search, setSearch] = useState('');

  // Filter projects based on title, description, or tags
  const filteredProjects = projects.filter((project) => {
    const searchText = search.toLowerCase();
    return (
      project.title.toLowerCase().includes(searchText) ||
      project.description.toLowerCase().includes(searchText) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchText))
    );
  });

  return (
    <>
      {/* Scroll progress bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-500 z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      {/* Search input */}
      <div className="p-4 pt-6">
        <input
          type="text"
          placeholder="Search projects..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-3 text-base rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white dark:border-gray-600"
        />
      </div>

      {/* Projects grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
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
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              {project.title}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-2">
              {project.description}
            </p>
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
    </>
  );
}
