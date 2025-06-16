import React from 'react';
import projects from '../projects.json';

export default function Portfolio() {
  // Helper function to get label based on type
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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {projects.map((project, index) => (
        <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow p-4">
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
        </div>
      ))}
    </div>
  );
}