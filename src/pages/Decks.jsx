import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db, auth, loginWithGoogle, logout } from "../firebase";

export default function Decks() {
  const [user, setUser] = useState(null);
  const [decks, setDecks] = useState([]);
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [deckName, setDeckName] = useState("");
  const [cards, setCards] = useState([]);
  const [cardForm, setCardForm] = useState({ question: "", answer: "" });
  const [showDueOnly, setShowDueOnly] = useState(true);

  /** --- Auth --- **/
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) fetchDecks(currentUser.uid);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    const loggedInUser = await loginWithGoogle();
    setUser(loggedInUser);
    fetchDecks(loggedInUser.uid);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setDecks([]);
    setCards([]);
    setSelectedDeck(null);
  };

  /** --- Deck Management --- **/
  const fetchDecks = async (uid) => {
    const q = query(collection(db, `users/${uid}/decks`));
    const snapshot = await getDocs(q);
    setDecks(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const createDeck = async () => {
    if (!deckName || !user) return;
    await addDoc(collection(db, `users/${user.uid}/decks`), { name: deckName });
    setDeckName("");
    fetchDecks(user.uid);
  };

  const selectDeck = (deck) => {
    setSelectedDeck(deck);
    fetchCards(deck.id);
  };

  /** --- Card Management --- **/
  const fetchCards = async (deckId) => {
    if (!user) return;
    const q = query(collection(db, `users/${user.uid}/cards`), where("deckId", "==", deckId));
    const snapshot = await getDocs(q);
    setCards(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
  };

  const handleCardChange = (e) => setCardForm({ ...cardForm, [e.target.name]: e.target.value });

  const addCard = async () => {
    if (!cardForm.question || !cardForm.answer || !selectedDeck || !user) return;
    await addDoc(collection(db, `users/${user.uid}/cards`), {
      deckId: selectedDeck.id,
      question: cardForm.question,
      answer: cardForm.answer,
      interval: 1,
      ease: 2.5,
      due: new Date().toISOString(),
    });
    setCardForm({ question: "", answer: "" });
    fetchCards(selectedDeck.id);
  };

  const deleteCard = async (cardId) => {
    if (!user) return;
    await deleteDoc(doc(db, `users/${user.uid}/cards`, cardId));
    fetchCards(selectedDeck.id);
  };

  const editCard = async (card) => {
    if (!user) return;
    const newQuestion = prompt("Edit question:", card.question);
    const newAnswer = prompt("Edit answer:", card.answer);
    if (newQuestion !== null && newAnswer !== null) {
      await updateDoc(doc(db, `users/${user.uid}/cards`, card.id), {
        question: newQuestion,
        answer: newAnswer,
      });
      fetchCards(selectedDeck.id);
    }
  };

  /** --- SRS Review --- **/
  const reviewCard = async (card, quality) => {
    if (!user) return;
    let interval = card.interval || 1;
    let ease = card.ease || 2.5;

    if (quality === "hard") interval = 1;
    else if (quality === "medium") interval = interval;
    else if (quality === "easy") interval = Math.round(interval * ease);

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + interval);

    await updateDoc(doc(db, `users/${user.uid}/cards`, card.id), {
      interval,
      due: dueDate.toISOString(),
    });

    fetchCards(selectedDeck.id);
  };

  if (!user) {
    return (
      <div className="p-4">
        <h1 className="text-xl font-bold mb-4">Decks</h1>
        <button onClick={handleLogin} className="bg-blue-500 text-white p-2">
          Login with Google
        </button>
      </div>
    );
  }

  const dueCards = cards.filter((card) =>
    showDueOnly ? new Date(card.due) <= new Date() : true
  );

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-xl font-bold">Decks</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white p-2">
          Logout
        </button>
      </div>

      {/* Create Deck */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="New deck name"
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
          className="border p-2 mr-2"
        />
        <button onClick={createDeck} className="bg-blue-500 text-white p-2">
          Add Deck
        </button>
      </div>

      <div className="flex gap-4">
        {/* Deck List */}
        <ul className="border p-4 w-1/3">
          {decks.map((deck) => (
            <li
              key={deck.id}
              className="mb-2 cursor-pointer"
              onClick={() => selectDeck(deck)}
            >
              {deck.name}
            </li>
          ))}
        </ul>

        {/* Card Editor & Review */}
        {selectedDeck && (
          <div className="border p-4 w-2/3">
            <h2 className="text-lg font-bold mb-2">
              {selectedDeck.name} - Cards
            </h2>

            {/* Card Form */}
            <div className="mb-4">
              <input
                type="text"
                name="question"
                placeholder="Question"
                value={cardForm.question}
                onChange={handleCardChange}
                className="border p-2 mr-2 w-1/2"
              />
              <input
                type="text"
                name="answer"
                placeholder="Answer"
                value={cardForm.answer}
                onChange={handleCardChange}
                className="border p-2 mr-2 w-1/2"
              />
              <button
                onClick={addCard}
                className="bg-green-500 text-white p-2"
              >
                Add Card
              </button>
            </div>

            {/* Show Due Only Toggle */}
            <div className="mb-2">
              <label>
                <input
                  type="checkbox"
                  checked={showDueOnly}
                  onChange={() => setShowDueOnly(!showDueOnly)}
                  className="mr-2"
                />
                Show Due Cards Only
              </label>
            </div>

            <ul>
              {dueCards.map((card) => (
                <li
                  key={card.id}
                  className="border-b py-2 flex justify-between items-center"
                >
                  <span>
                    {card.question} → {card.answer} (
                    {new Date(card.due).toLocaleDateString()})
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => editCard(card)}
                      className="bg-yellow-500 text-white p-1 px-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCard(card.id)}
                      className="bg-red-500 text-white p-1 px-2"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => reviewCard(card, "easy")}
                      className="bg-green-500 text-white p-1 px-2"
                    >
                      Easy
                    </button>
                    <button
                      onClick={() => reviewCard(card, "medium")}
                      className="bg-yellow-600 text-white p-1 px-2"
                    >
                      Medium
                    </button>
                    <button
                      onClick={() => reviewCard(card, "hard")}
                      className="bg-red-500 text-white p-1 px-2"
                    >
                      Hard
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            {dueCards.length === 0 && <p className="mt-2">No cards due!</p>}
          </div>
        )}
      </div>
    </div>
  );
}
