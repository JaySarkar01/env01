import React from "react";

export default function Home() {
  return (
    <main className="flex-1 p-6 md:p-8 lg:p-10">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
          Welcome to Your Dashboard
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
          Get started by exploring the navigation or viewing your recent activity.
        </p>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Quick Stats
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Projects', 'Tasks', 'Team'].map((item) => (
              <div key={item} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400">{item}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">0</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}