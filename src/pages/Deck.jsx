import { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { Link } from "react-router-dom";

export default function Decks() {
  const [decks, setDecks] = useState([]);
  const [name, setName] = useState("");

  const fetchDecks = async () => {
    const querySnapshot = await getDocs(collection(db, "decks"));
    setDecks(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const createDeck = async () => {
    if (!name) return;
    await addDoc(collection(db, "decks"), { name });
    setName("");
    fetchDecks();
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Decks</h1>
      <input
        type="text"
        placeholder="New deck name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 mr-2"
      />
      <button onClick={createDeck} className="bg-blue-500 text-white p-2">
        Add Deck
      </button>

      <ul className="mt-4 space-y-2">
        {decks.map(deck => (
          <li key={deck.id}>
            <Link to={`/review/${deck.id}`} className="text-blue-500 underline">
              {deck.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
