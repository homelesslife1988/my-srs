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

  const deleteDeck = async (deckId) => {
    if (!window.confirm("Are you sure you want to delete this deck? All cards will be deleted.")) return;

    // Delete all cards in this deck
    const cardsQuery = query(collection(db, `users/${user.uid}/cards`), where("deckId", "==", deckId));
    const cardSnapshot = await getDocs(cardsQuery);
    for (const cardDoc of cardSnapshot.docs) {
      await deleteDoc(doc(db, `users/${user.uid}/cards`, cardDoc.id));
    }

    // Delete the deck itself
    await deleteDoc(doc(db, `users/${user.uid}/decks`, deckId));

    if (selectedDeck?.id === deckId) setSelectedDeck(null);
    fetchDecks();
  };

  return (
    <div className="w-full md:w-1/3 bg-white rounded-lg shadow p-4 border border-gray-200 flex flex-col gap-4">
      {/* Add Deck */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          type="text"
          placeholder="New deck name"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          className="flex-1 border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-full md:w-auto"
        />
        <button
          onClick={createDeck}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-2 px-4 rounded shadow w-full md:w-auto"
        >
          Add
        </button>
      </div>

      {/* Deck List */}
      <ul className="flex flex-col gap-2">
        {decks.map(deck => (
          <li
            key={deck.id}
            className={`flex justify-between items-center p-2 rounded border hover:bg-indigo-50 ${selectedDeck?.id === deck.id ? 'bg-indigo-100' : ''}`}
          >
            <span
              onClick={() => setSelectedDeck(deck)}
              className="cursor-pointer flex-1"
            >
              {deck.name}
            </span>

            <div className="flex gap-2 ml-4">
              <Link
                to={`/review/${deck.id}`}
                className="bg-indigo-500 hover:bg-indigo-600 text-white py-1 px-3 rounded shadow text-sm whitespace-nowrap"
              >
                Review
              </Link>
              <button
                onClick={() => deleteDeck(deck.id)}
                className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded shadow text-sm whitespace-nowrap"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
