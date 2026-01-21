'use client';

import { useEffect, useState } from "react";
import API from '../../lib/api';
import { FaFileAlt, FaStar, FaUsers } from "react-icons/fa";

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [displayStats, setDisplayStats] = useState({ articles: 0, reviews: 0, users: 0 });
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await API.get("/stats");
        setStats(data.data);
      } catch (err) {
        console.error("Failed to load stats:", err);
      }
    };

    fetchStats();
  }, []);

  // Smooth count-up effect
  useEffect(() => {
    if (!stats) return;

    const duration = 1000; // 1 second
    const steps = 60;
    let currentStep = 0;

    const increment = () => {
      currentStep++;
      setDisplayStats({
        articles: Math.floor((stats.articles / steps) * currentStep),
        reviews: Math.floor((stats.reviews / steps) * currentStep),
        users: Math.floor((stats.users / steps) * currentStep),
      });

      if (currentStep < steps) {
        requestAnimationFrame(increment);
      } else {
        setDisplayStats(stats); // Ensure exact final values
      }
    };

    requestAnimationFrame(increment);
  }, [stats]);

  // Toggle dark mode
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode]);

  return (
    <div className="min-h-screen p-6 dark:bg-gray-900 dark:text-white transition-colors">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {!stats ? (
        <div className="space-y-4">
          {[1, 2, 3].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Articles */}
          <div className="border p-6 rounded-lg shadow bg-white dark:bg-gray-800 flex items-center space-x-4">
            <FaFileAlt className="text-3xl text-blue-500" />
            <div>
              <h2 className="text-xl font-semibold">Articles</h2>
              <p className="text-4xl font-bold">{displayStats.articles}</p>
              <p className="text-gray-500 dark:text-gray-300 text-sm mt-2">
                Last: {stats.lastArticleDate ? new Date(stats.lastArticleDate).toLocaleDateString() : "—"}
              </p>
            </div>
          </div>

          {/* Reviews */}
          <div className="border p-6 rounded-lg shadow bg-white dark:bg-gray-800 flex items-center space-x-4">
            <FaStar className="text-3xl text-yellow-500" />
            <div>
              <h2 className="text-xl font-semibold">Reviews</h2>
              <p className="text-4xl font-bold">{displayStats.reviews}</p>
              <p className="text-gray-500 dark:text-gray-300 text-sm mt-2">
                Last: {stats.lastReviewDate ? new Date(stats.lastReviewDate).toLocaleDateString() : "—"}
              </p>
            </div>
          </div>

          {/* Users */}
          <div className="border p-6 rounded-lg shadow bg-white dark:bg-gray-800 flex items-center space-x-4">
            <FaUsers className="text-3xl text-green-500" />
            <div>
              <h2 className="text-xl font-semibold">Users</h2>
              <p className="text-4xl font-bold">{displayStats.users}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
