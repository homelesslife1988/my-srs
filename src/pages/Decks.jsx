import { useEffect, useState } from "react";
import { auth, loginWithGoogle, logout } from "../firebase";
import DeckList from "../components/DeckList";
import CardEditor from "../components/CardEditor";

export default function Decks() {
  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(currentUser => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    const loggedInUser = await loginWithGoogle();
    setUser(loggedInUser);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setDecks([]);
    setSelectedDeck(null);
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6">Decks</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow"
        >
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-50 p-6 gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center w-full max-w-6xl">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4 md:mb-0">Your Decks</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded shadow"
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="flex flex-col md:flex-row w-full max-w-6xl gap-6">
        <DeckList
          user={user}
          decks={decks}
          setDecks={setDecks}
          selectedDeck={selectedDeck}
          setSelectedDeck={setSelectedDeck}
        />

        {selectedDeck ? (
          <CardEditor user={user} deck={selectedDeck} />
        ) : (
          <div className="flex-1 bg-white rounded-lg shadow p-6 border border-gray-200 text-center text-gray-500">
            Select a deck to edit cards.
          </div>
        )}
      </div>
    </div>
  );
}
