import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function DeckList({ user, decks, setDecks, selectedDeck, setSelectedDeck }) {
  const [deckName, setDeckName] = useState("");

  useEffect(() => {
    if (user) fetchDecks();
  }, [user]);

  const fetchDecks = async () => {
    const snapshot = await getDocs(collection(db, `users/${user.uid}/decks`));
    setDecks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const createDeck = async () => {
    if (!deckName) return;
    await addDoc(collection(db, `users/${user.uid}/decks`), { name: deckName });
    setDeckName("");
    fetchDecks();
  };

  /** --- Delete deck + its cards --- **/
  const deleteDeck = async (deckId) => {
    // Confirm deletion
    if (!window.confirm("Are you sure you want to delete this deck? All cards will be deleted.")) return;

    // Delete all cards in this deck
    const cardsQuery = query(collection(db, `users/${user.uid}/cards`), where("deckId", "==", deckId));
    const cardSnapshot = await getDocs(cardsQuery);
    for (const cardDoc of cardSnapshot.docs) {
      await deleteDoc(doc(db, `users/${user.uid}/cards`, cardDoc.id));
    }

    // Delete the deck itself
    await deleteDoc(doc(db, `users/${user.uid}/decks`, deckId));

    // Refresh list
    if (selectedDeck?.id === deckId) setSelectedDeck(null);
    fetchDecks();
  };

  return (
    <div className="w-1/3 bg-white rounded shadow p-4 border border-gray-200">
      {/* Add Deck */}
      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="New deck name"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          className="flex-1 border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button
          onClick={createDeck}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded shadow"
        >
          Add
        </button>
      </div>

      {/* Decks */}
      <ul>
        {decks.map(deck => (
          <li key={deck.id} className={`p-2 mb-2 rounded cursor-pointer hover:bg-indigo-50 hover:text-indigo-700 ${selectedDeck?.id === deck.id ? 'bg-indigo-100' : ''}`}>
            <div className="flex justify-between items-center">
              <span onClick={() => setSelectedDeck(deck)}>{deck.name}</span>
              <div className="flex gap-2">
                <Link
                  to={`/review/${deck.id}`}
                  className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded shadow text-sm"
                >
                  Review
                </Link>
                <button
                  onClick={() => deleteDeck(deck.id)}
                  className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded shadow text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
