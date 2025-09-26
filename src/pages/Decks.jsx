import { useEffect, useState } from "react";
import { auth, loginWithGoogle, logout } from "../firebase";
import DeckList from "../components/DeckList";
import CardEditor from "../components/CardEditor";

export default function Decks() {
  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
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
      <div className="p-6 max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-indigo-700 mb-4">Decks</h1>
        <button
          onClick={handleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded shadow"
        >
          Login with Google
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-indigo-700">Your Decks</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded shadow"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-6">
        {/* Deck List */}
        <DeckList
          user={user}
          decks={decks}
          setDecks={setDecks}
          selectedDeck={selectedDeck}
          setSelectedDeck={setSelectedDeck}
        />

        {/* Card Editor */}
        {selectedDeck && (
          <CardEditor
            user={user}
            deck={selectedDeck}
          />
        )}
      </div>
    </div>
  );
}
