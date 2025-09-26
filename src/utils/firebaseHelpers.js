import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

export async function getDueCards(uid, deckId) {
  const q = query(
    collection(db, `users/${uid}/cards`),
    where("deckId", "==", deckId)
  );
  const snapshot = await getDocs(q);
  const allCards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  // Return only cards where due date <= now
  return allCards.filter(card => new Date(card.due) <= new Date());
}
