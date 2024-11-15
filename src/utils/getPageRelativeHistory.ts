import { LookupHistory } from "../types";

function getPageRelativeHistory(history: LookupHistory | null, pageText: string) {
  if (!history) {
    return [];
  }
  const historyWords = Object.keys(history)
    // to exclude unwanted words to be included in the review
    .filter(item => history[item].review);

  const regExRules = (word: string) => [
    new RegExp(`^${word}\\s`),
    new RegExp(`\\s${word}\\s`),
    new RegExp(`\\s${word}[.,;?!:]`)
  ];

  const checkRegExRulesFor = (word: string) => regExRules(word).some(r => r.test(pageText));

  const checkWordExistence = (word: string) => {
    const lcWord = word.toLowerCase();
    const wordWithS = lcWord + "s";
    const wordWithEs = lcWord + "es";
    const wordWithD = lcWord + "d";
    const wordWithEd = lcWord + "ed";
    return (
      // to check for lowercase form of the word
      checkRegExRulesFor(lcWord)

      // to check for plural forms ending with "s", e.g: cat => cats
      || checkRegExRulesFor(wordWithS)

      // to check for plural forms ending with "es", e.g: glass => glasses
      || checkRegExRulesFor(wordWithEs)

      // to check for past forms ending with "d", e.g: love => loved
      || checkRegExRulesFor(wordWithD)

      // to check for past forms ending with "d", e.g: pair => paired
      || checkRegExRulesFor(wordWithEd)
    );
  };

  return historyWords.filter(checkWordExistence);
}

export default getPageRelativeHistory;
