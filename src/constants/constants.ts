import { OptionsType } from "../types";

export const publicApiDetails = {
  key: "6b3a80cc-9d9f-4007-9ee5-52a24ab7eb31",
  type: "sd3",
  usageLimitPerInstall: 20
} as const;

export const defaultOptions: OptionsType = {
  apiKey: publicApiDetails.key,
  apiType: publicApiDetails.type,
  wordSelectMode: "",
  pauseVideoOnPopupOpen: true,
  isRelativeHistoryPromoted: false,
  reviewMode: false,
  theme: "auto",
  textSize: "16px"
};

export const API_TYPES = {
  "Dictionary": "collegiate",
  "Thesaurus": "thesaurus",
  "Intermediate Thesaurus": "ithesaurus",
  "Spanish": "spanish",
  "medical_v2": "medical",
  "Elementary Dictionary": "sd2",
  "Intermediate Dictionary": "sd3",
  "School Dictionary": "sd4",
  "Learner's": "learners"
} as const;

export const ERRORS = {
  EMPTY_SEARCH: "Looking up for nothing!",
  PERSONAL_KEY_NEEDED: "You've reached the limit for using public API key. Please add your FREE personal API key to keep using this extension.\n"
    + "Check the Options page for instructions on how to get your key.",
  INVALID_API_KEY: "Invalid API key settings.\n"
    + "Please ensure your API key is correct and that the API key matches with the API type.",
  FAILED_TO_FETCH: "It looks like you're offline!",
  NO_RESULT: "No results found!"
};

export const REVIEW_US = [
  "Time flies! Leave a review now!",
  "Be a hero and leave a review!",
  "We believe in the magic of reviews!",
  "Your review = our happiness!",
  "Your opinion matters! Please review now.",
  "We'd love to hear your feedback!",
  "Help us improve — send a review now!"
];
