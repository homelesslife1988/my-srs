import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from "firebase/firestore";
import { db } from "../firebase";

export default function CardEditor({ user, deck }) {
  const [cards, setCards] = useState([]);
  const [cardForm, setCardForm] = useState({ question: "", answer: "" });
  const [showDueOnly, setShowDueOnly] = useState(true);

  useEffect(() => {
    if (!deck) {
      // Clear state if deck is null (deleted)
      setCards([]);
      setCardForm({ question: "", answer: "" });
      return;
    }
    fetchCards();
  }, [deck]);

  const fetchCards = async () => {
    const snapshot = await getDocs(collection(db, `users/${user.uid}/cards`));
    const allCards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    const deckCards = allCards.filter(c => c.deckId === deck.id);
    setCards(deckCards);
  };

  const handleCardChange = (e) => setCardForm({ ...cardForm, [e.target.name]: e.target.value });

  const addCard = async () => {
    if (!cardForm.question || !cardForm.answer) return;
    if (!deck) return; // safety check
    await addDoc(collection(db, `users/${user.uid}/cards`), {
      deckId: deck.id,
      question: cardForm.question,
      answer: cardForm.answer,
      interval: 1,
      ease: 2.5,
      due: new Date().toISOString(),
    });
    setCardForm({ question: "", answer: "" });
    fetchCards();
  };

  const editCard = async (card) => {
    const q = prompt("Edit question:", card.question);
    const a = prompt("Edit answer:", card.answer);
    if (q !== null && a !== null) {
      await updateDoc(doc(db, `users/${user.uid}/cards`, card.id), { question: q, answer: a });
      fetchCards();
    }
  };

  const deleteCard = async (id) => {
    await deleteDoc(doc(db, `users/${user.uid}/cards`, id));
    fetchCards();
  };

  const dueCards = cards.filter(card => showDueOnly ? new Date(card.due) <= new Date() : true);

  if (!deck) {
    return (
      <div className="flex-1 bg-white rounded shadow p-6 border border-gray-200 text-center text-gray-500">
        Select a deck to edit cards.
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded shadow p-6 border border-gray-200">
      <h2 className="text-xl font-bold mb-4 text-indigo-700">{deck.name} - Cards</h2>

      {/* Card Form */}
      <div className="flex flex-col md:flex-row gap-3 mb-4">
        <input
          type="text"
          name="question"
          placeholder="Question"
          value={cardForm.question}
          onChange={handleCardChange}
          className="flex-1 border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <input
          type="text"
          name="answer"
          placeholder="Answer"
          value={cardForm.answer}
          onChange={handleCardChange}
          className="flex-1 border border-gray-300 p-2 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
        <button onClick={addCard} className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow">
          Add Card
        </button>
      </div>

      {/* Due Only Toggle */}
      <div className="mb-4">
        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={showDueOnly}
            onChange={() => setShowDueOnly(!showDueOnly)}
            className="form-checkbox h-5 w-5 text-indigo-600"
          />
          <span>Show Due Cards Only</span>
        </label>
      </div>

      {/* Card List */}
      <ul>
        {dueCards.map(card => (
          <li key={card.id} className="flex flex-col md:flex-row justify-between items-start md:items-center border-b py-3">
            <div>
              <p className="font-semibold">{card.question}</p>
              <p className="text-gray-600 text-sm">{card.answer}</p>
              <p className="text-gray-400 text-xs">Due: {new Date(card.due).toLocaleDateString()}</p>
            </div>
            <div className="flex gap-2 mt-2 md:mt-0">
              <button onClick={() => editCard(card)} className="bg-yellow-400 hover:bg-yellow-500 text-white py-1 px-2 rounded">Edit</button>
              <button onClick={() => deleteCard(card.id)} className="bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded">Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
