'use client'; // Ensures client-side rendering
import { useEffect, useState } from 'react';

export default function BoardGames() {
  const [games, setGames] = useState<{ name: string; image: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostWanted, setMostWanted] = useState<{ name: string; image: string }[]>([]);
  const [loadingMostWanted, setLoadingMostWanted] = useState(true);
  const [reallyWant, setReallyWant] = useState<{ name: string; image: string }[]>([]);
  const [loadingReallyWant, setLoadingReallyWant] = useState(true);
  const [interestedIn, setInterestedIn] = useState<{ name: string; image: string }[]>([]);
  const [loadingInterestedIn, setLoadingInterestedIn] = useState(true);

  // Function to fetch data with retry logic
  const fetchGamesWithRetry = async (url: string, setData: React.Dispatch<React.SetStateAction<{ name: string; image: string }[]>>, setLoading: React.Dispatch<React.SetStateAction<boolean>>, maxRetries: number = 5, delay: number = 2000) => {
    let attempt = 0;
    let response = null;

    while (attempt < maxRetries) {
      try {
        response = await fetch(url);
        if (response.ok) {
          const xmlString = await response.text();
          const parser = new DOMParser();
          const xmlDoc = parser.parseFromString(xmlString, 'application/xml');

          // Check if the response contains the expected data
          const items = xmlDoc.getElementsByTagName('item');
          if (items.length > 0) {
            const gameList = Array.from(items).map((item) => {
              const nameElement = item.getElementsByTagName('name')[0];
              const name = nameElement ? nameElement.textContent || 'Unknown' : 'Unknown';
              const image = item.getElementsByTagName('image')[0]?.textContent || '';
              return { name, image };
            });

            setData(gameList);
            setLoading(false);
            return; // Exit function if data is received
          }
        } else if (response.status === 202) {
          console.log('Status 202: Request is being processed, retrying...');
          attempt++;
          await new Promise(resolve => setTimeout(resolve, delay)); // Wait before retrying
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (error) {
        console.error('Error fetching the board games:', error);
        attempt++;
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          setLoading(false);
          console.error('Max retries reached. Could not fetch data.');
        }
      }
    }
  };

  // Fetch data for all sections when the component mounts
  useEffect(() => {
    fetchGamesWithRetry('https://boardgamegeek.com/xmlapi2/collection?username=Edu22&own=1', setGames, setLoading);
    fetchGamesWithRetry('https://boardgamegeek.com/xmlapi2/collection?username=Edu22&wishlistpriority=2', setMostWanted, setLoadingMostWanted);
    fetchGamesWithRetry('https://boardgamegeek.com/xmlapi2/collection?username=Edu22&wishlistpriority=3', setReallyWant, setLoadingReallyWant);
    fetchGamesWithRetry('https://boardgamegeek.com/xmlapi2/collection?username=Edu22&wishlistpriority=4', setInterestedIn, setLoadingInterestedIn);
  }, []);

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundImage: 'url("bliss.jpg")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
      {/* Top bar */}
      <div className="flex items-center h-12 px-4 bg-transparent text-white"></div>

      {/* Header */}
      <h1 className="text-4xl font-bold text-center py-4">Edu's board game list</h1>
      
      {/* BGG Profile Link */}
      <div className="text-center mb-4">
        <a href="https://boardgamegeek.com/user/Edu22" className="text-blue-500 underline text-lg">BGG Profile Link</a>
      </div>

      {/* Main content container */}
      <div className="flex flex-1">
        {/* Left section (Board games owned) */}
        <div className="flex-1 p-4">
          <div className="bg-white bg-opacity-50 rounded-lg p-4 shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-center">Board games owned:</h2>
            {loading ? (
              <p className="text-center">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {games.map((game, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <span className="font-semibold text-lg text-center mb-2">{game.name}</span>
                    {game.image && (
                      <img
                        src={game.image}
                        alt={`${game.name} image`}
                        className="w-32 h-32 object-contain"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
            {/* Placeholder for an image */}
            <div className="mt-4 flex justify-center">
              <img src="/Ralsei.png" alt="Game image" className="w-64 h-64 object-contain" />
            </div>
          </div>
        </div>

        {/* Right section (Wishlist sections) */}
        <div className="flex-1 p-4">
          {/* Most wanted */}
          <div className="bg-white bg-opacity-50 rounded-lg p-4 shadow-lg mb-6">
            <h2 className="text-3xl font-bold mb-4 text-center">Most wanted:</h2>
            {loadingMostWanted ? (
              <p className="text-center">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 gap-6 mb-8">
                {mostWanted.map((game, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <span className="font-semibold text-lg text-center mb-2">{game.name}</span>
                    {game.image && (
                      <img
                        src={game.image}
                        alt={`${game.name} image`}
                        className="w-32 h-32 object-contain"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Really want */}
          <div className="bg-white bg-opacity-50 rounded-lg p-4 shadow-lg mb-6">
            <h2 className="text-3xl font-bold mb-4 text-center">Really want:</h2>
            {loadingReallyWant ? (
              <p className="text-center">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 gap-6 mb-8">
                {reallyWant.map((game, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <span className="font-semibold text-lg text-center mb-2">{game.name}</span>
                    {game.image && (
                      <img
                        src={game.image}
                        alt={`${game.name} image`}
                        className="w-32 h-32 object-contain"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interested in */}
          <div className="bg-white bg-opacity-50 rounded-lg p-4 shadow-lg">
            <h2 className="text-3xl font-bold mb-4 text-center">Interested in:</h2>
            {loadingInterestedIn ? (
              <p className="text-center">Loading...</p>
            ) : (
              <div className="grid grid-cols-2 gap-6">
                {interestedIn.map((game, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <span className="font-semibold text-lg text-center mb-2">{game.name}</span>
                    {game.image && (
                      <img
                        src={game.image}
                        alt={`${game.name} image`}
                        className="w-32 h-32 object-contain"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
