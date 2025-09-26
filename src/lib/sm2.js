// src/lib/sm2.js
import { TimestampLib } from '../firebase';

export function nextReviewSM2(card, quality) {
  // card: { repetition, ef, interval }
  // quality: 0..5 (5 = perfect)
  const MIN_EF = 1.3;

  let repetition = card.repetition ?? 0;
  let ef = card.ef ?? 2.5;
  let interval = card.interval ?? 0;

  if (quality < 3) {
    repetition = 0;
    interval = 1;
  } else {
    repetition += 1;
    if (repetition === 1) interval = 1;
    else if (repetition === 2) interval = 6;
    else interval = Math.round(interval * ef);

    // update easiness factor
    ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (ef < MIN_EF) ef = MIN_EF;
  }

  const nextReviewDate = new Date(Date.now() + interval * 24 * 60 * 60 * 1000);

  return {
    repetition,
    ef,
    interval,
    lastReview: TimestampLib.fromDate(new Date()),
    nextReview: TimestampLib.fromDate(nextReviewDate),
  };
}
