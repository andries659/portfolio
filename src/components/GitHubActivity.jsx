import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCodeCommit,
  faArrowUpRightFromSquare,
} from '@fortawesome/free-solid-svg-icons';

const USERNAME = 'andries659';

// GitHub's public events API gives us recent public activity.
// We turn those events into a contribution-style heatmap.
const API_URL = `https://api.github.com/users/${USERNAME}/events/public?per_page=100`;

function getDateKey(date) {
  return new Date(date).toISOString().slice(0, 10);
}

function createCalendar() {
  const today = new Date();

  // Approximately the last year.
  const start = new Date(today);
  start.setDate(today.getDate() - 364);

  // Move back to Sunday so the grid starts cleanly.
  start.setDate(start.getDate() - start.getDay());

  const days = [];

  const cursor = new Date(start);

  while (cursor <= today) {
    days.push({
      date: new Date(cursor),
      key: cursor.toISOString().slice(0, 10),
      count: 0,
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return days;
}

function getLevel(count) {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 6) return 3;
  return 4;
}

function formatDate(dateString) {
  return new Date(`${dateString}T12:00:00`).toLocaleDateString(
    undefined,
    {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  );
}

export default function GitHubActivity() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadActivity() {
      try {
        setLoading(true);
        setError(false);

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error('GitHub activity request failed');
        }

        const data = await response.json();

        if (!cancelled) {
          setEvents(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.error('GitHub activity error:', err);

        if (!cancelled) {
          setError(true);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadActivity();

    return () => {
      cancelled = true;
    };
  }, []);

  const activity = useMemo(() => {
    const calendar = createCalendar();

    const counts = {};

    events.forEach((event) => {
      const dateKey = getDateKey(event.created_at);

      counts[dateKey] = (counts[dateKey] || 0) + 1;
    });

    return calendar.map((day) => ({
      ...day,
      count: counts[day.key] || 0,
    }));
  }, [events]);

  const totalActivity = useMemo(() => {
    return activity.reduce(
      (total, day) => total + day.count,
      0
    );
  }, [activity]);

  const maxActivity = useMemo(() => {
    return Math.max(
      ...activity.map((day) => day.count),
      1
    );
  }, [activity]);

  // Turn the flat array into columns of seven days.
  const weeks = useMemo(() => {
    const result = [];

    for (let i = 0; i < activity.length; i += 7) {
      result.push(activity.slice(i, i + 7));
    }

    return result;
  }, [activity]);

  if (loading) {
    return (
      <section className="github-activity">
        <div className="github-activity-heading">
          <div>
            <span className="github-activity-label">
              // ACTIVITY
            </span>

            <h3>Contribution Activity</h3>
          </div>
        </div>

        <div className="github-activity-loading">
          Loading GitHub activity...
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="github-activity">
        <div className="github-activity-heading">
          <div>
            <span className="github-activity-label">
              // ACTIVITY
            </span>

            <h3>Contribution Activity</h3>
          </div>
        </div>

        <div className="github-activity-error">
          <p>GitHub activity is temporarily unavailable.</p>

          <a
            href={`https://github.com/${USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            View GitHub
            <FontAwesomeIcon
              icon={faArrowUpRightFromSquare}
            />
          </a>
        </div>
      </section>
    );
  }

  return (
    <section className="github-activity">
      <div className="github-activity-heading">
        <div>
          <span className="github-activity-label">
            // ACTIVITY
          </span>

          <h3>Contribution Activity</h3>

          <p>
            {totalActivity} public GitHub events detected
            recently.
          </p>
        </div>

        <a
          href={`https://github.com/${USERNAME}`}
          target="_blank"
          rel="noopener noreferrer"
          className="github-activity-link"
        >
          <FontAwesomeIcon icon={faCodeCommit} />
          @{USERNAME}
          <FontAwesomeIcon
            icon={faArrowUpRightFromSquare}
          />
        </a>
      </div>

      <div className="github-heatmap-wrapper">
        <div className="github-months">
          <span>Jan</span>
          <span>Feb</span>
          <span>Mar</span>
          <span>Apr</span>
          <span>May</span>
          <span>Jun</span>
          <span>Jul</span>
          <span>Aug</span>
          <span>Sep</span>
          <span>Oct</span>
          <span>Nov</span>
          <span>Dec</span>
        </div>

        <div className="github-heatmap">

          <div className="github-weekdays">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>

          <div className="github-weeks">
            {weeks.map((week, weekIndex) => (
              <div
                className="github-week"
                key={weekIndex}
              >
                {week.map((day) => {
                  const level = getLevel(day.count);

                  return (
                    <div
                      key={day.key}
                      className={`github-day level-${level}`}
                      title={`${day.count} public event${
                        day.count === 1 ? '' : 's'
                      } on ${formatDate(day.key)}`}
                      aria-label={`${day.count} public events on ${formatDate(day.key)}`}
                    />
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        <div className="github-heatmap-footer">
          <span>
            Last year
          </span>

          <div className="github-legend">
            <span>Less</span>
            <i className="level-0" />
            <i className="level-1" />
            <i className="level-2" />
            <i className="level-3" />
            <i className="level-4" />
            <span>More</span>
          </div>
        </div>
      </div>

      <div className="github-activity-note">
        <span>●</span>
        Activity shown from GitHub's public events API.
        GitHub may limit how far back public events are
        available.
        <span className="github-api-limit">
          API max: {maxActivity} events/day
        </span>
      </div>
    </section>
  );
}
