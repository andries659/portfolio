import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGithub,
  faJs,
  faPython,
} from '@fortawesome/free-brands-svg-icons';
import {
  faCodeBranch,
  faCode,
  faStar,
  faUsers,
  faArrowUpRightFromSquare,
  faCircleNotch,
} from '@fortawesome/free-solid-svg-icons';

const USERNAME = 'andries659';

const languageColors = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3776ab',
  CSharp: '#9b4f96',
  HTML: '#e34c26',
  CSS: '#563d7c',
  Java: '#b07219',
  C: '#555555',
  'C++': '#f34b7d',
  Shell: '#89e051',
  PHP: '#4F5D95',
  Go: '#00ADD8',
  Rust: '#dea584',
};

function StatCard({ icon, value, label }) {
  return (
    <motion.div
      className="github-stat-card"
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
    >
      <div className="github-stat-icon">
        <FontAwesomeIcon icon={icon} />
      </div>

      <div className="github-stat-value">
        {value}
      </div>

      <div className="github-stat-label">
        {label}
      </div>
    </motion.div>
  );
}

function LanguageIcon({ language }) {
  if (language === 'JavaScript') {
    return <FontAwesomeIcon icon={faJs} />;
  }

  if (language === 'Python') {
    return <FontAwesomeIcon icon={faPython} />;
  }

  return <FontAwesomeIcon icon={faCode} />;
}

export default function GitHubStats() {
  const [profile, setProfile] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadGitHubData() {
      try {
        setLoading(true);
        setError(false);

        const [profileResponse, reposResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${USERNAME}`),
          fetch(
            `https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=30`
          ),
        ]);

        if (!profileResponse.ok || !reposResponse.ok) {
          throw new Error('GitHub API request failed');
        }

        const profileData = await profileResponse.json();
        const reposData = await reposResponse.json();

        if (!cancelled) {
          setProfile(profileData);
          setRepos(reposData);
        }
      } catch (err) {
        console.error('GitHub stats error:', err);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadGitHubData();

    return () => {
      cancelled = true;
    };
  }, []);

  const stars = useMemo(() => {
    return repos.reduce(
      (total, repo) => total + (repo.stargazers_count || 0),
      0
    );
  }, [repos]);

  const languages = useMemo(() => {
    const counts = {};

    repos.forEach((repo) => {
      if (repo.language) {
        counts[repo.language] = (counts[repo.language] || 0) + 1;
      }
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [repos]);

  if (loading) {
    return (
      <section className="github-section">
        <div className="github-section-header">
          <span>// GITHUB</span>
        </div>

        <div className="github-loading">
          <FontAwesomeIcon
            icon={faCircleNotch}
            spin
          />
          Loading GitHub data...
        </div>
      </section>
    );
  }

  if (error || !profile) {
    return (
      <section className="github-section">
        <div className="github-section-header">
          <span>// GITHUB</span>
        </div>

        <div className="github-error">
          <p>Unable to load GitHub statistics right now.</p>

          <a
            href={`https://github.com/${USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="github-button"
          >
            <FontAwesomeIcon icon={faGithub} />
            Open GitHub
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="github-section">
      <div className="github-section-header">
        <span>// GITHUB</span>

        <a
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="github-header-link"
        >
          @{USERNAME}
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
        </a>
      </div>

      <div className="github-intro">
        <div>
          <h2>GitHub Activity</h2>

          <p>
            A live snapshot of my public GitHub profile,
            repositories, and development activity.
          </p>
        </div>

        <a
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="github-button"
        >
          <FontAwesomeIcon icon={faGithub} />
          View GitHub
        </a>
      </div>

      <div className="github-stats-grid">
        <StatCard
          icon={faCodeBranch}
          value={profile.public_repos}
          label="Repositories"
        />

        <StatCard
          icon={faStar}
          value={stars}
          label="Stars"
        />

        <StatCard
          icon={faUsers}
          value={profile.followers}
          label="Followers"
        />

        <StatCard
          icon={faUsers}
          value={profile.following}
          label="Following"
        />
      </div>

      <div className="github-content-grid">

        {/* Languages */}
        <div className="github-panel">
          <div className="github-panel-title">
            <FontAwesomeIcon icon={faCode} />
            Languages
          </div>

          {languages.length === 0 ? (
            <p className="github-muted">
              No language data available.
            </p>
          ) : (
            <div className="github-languages">
              {languages.map(([language, count]) => (
                <div
                  className="github-language"
                  key={language}
                >
                  <div className="github-language-name">
                    <span
                      className="github-language-dot"
                      style={{
                        background:
                          languageColors[language] || '#3dffa0',
                      }}
                    />

                    <LanguageIcon language={language} />

                    <span>{language}</span>
                  </div>

                  <span className="github-language-count">
                    {count} {count === 1 ? 'repo' : 'repos'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Repositories */}
        <div className="github-panel">
          <div className="github-panel-title">
            <FontAwesomeIcon icon={faCodeBranch} />
            Recently Updated
          </div>

          <div className="github-repositories">
            {repos.slice(0, 5).map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="github-repository"
              >
                <div>
                  <strong>{repo.name}</strong>

                  <span>
                    {repo.language || 'Code'}
                    {' · '}
                    ★ {repo.stargazers_count}
                  </span>
                </div>

                <FontAwesomeIcon
                  icon={faArrowUpRightFromSquare}
                />
              </a>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
