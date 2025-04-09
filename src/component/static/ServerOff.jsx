import React from 'react';

export default function ServerOff() {
  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <div className="text-center text-white">
        <div className="text-6xl mb-4">
          <span className="animate-bounce">🚧</span>
        </div>
        <h2 className="text-3xl font-semibold mb-2">
          Server is currently down or under maintenance.
        </h2>
        <p className="text-lg">
          Please try reloading the page or check back later.
        </p>
      </div>
    </div>
  );
}