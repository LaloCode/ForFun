'use client'; // Add this to make the component client-side

import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const handleDoubleClick = (path: string) => {
    router.push(path);
  };

  return (
    <main className="min-h-screen bg-blue-200 flex flex-col">
      {/* Icon grid */}
      <div className="flex-1 overflow-auto grid grid-cols-8 grid-rows-8 gap-4 p-4">
        {/* Example icon */}
        <div
          className="icon-container"
          onDoubleClick={() => handleDoubleClick('/board-games')}
        >
          <div className="icon">
            <img src="/boardgamesicon.png" alt="Board games icon" className="icon-image" />
            <p className="icon-label">Board games</p>
          </div>
        </div>
        {/* Add more icons as needed */}
      </div>

      {/* Taskbar */}
      <div className="taskbar">
        <button className="start-button">Start</button>
      </div>
    </main>
  );
}
