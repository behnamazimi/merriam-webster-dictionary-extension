export const globalActions = {
  INIT: "INIT",
  POPUP_INIT: "POPUP_INIT",
  SET_OPTIONS: "SET_OPTIONS",
  LINK_TO_POPUP: "GET_SELECTED_TEXT",
  ON_POPUP_CLOSE: "ON_POPUP_CLOSE",
  ADD_TO_HISTORY: "ADD_TO_HISTORY",
  TOGGLE_HISTORY_REVIEW: "TOGGLE_HISTORY_REVIEW",
  CLEAR_HISTORY: "CLEAR_HISTORY",
  GET_PUBLIC_API_USAGE: "GET_PUBLIC_API_USAGE",
  COUNT_UP_PUBLIC_API_USAGE: "COUNT_UP_PUBLIC_API_USAGE",
}

export const publicApiDetails = {
  key: "6b3a80cc-9d9f-4007-9ee5-52a24ab7eb31",
  type: "sd3",
  usageLimitPerInstall: 20
}

export const defaultOptions = {
  apiKey: publicApiDetails.key,
  apiType: publicApiDetails.type,
  wordSelectMode: "",
  pauseVideoOnPopupOpen: true,
  isRelativeHistoryPromoted: false,
  reviewMode: null,
}

export const API_TYPES = {
  "Dictionary": "collegiate",
  "Thesaurus": "thesaurus",
  "Intermediate Thesaurus": "ithesaurus",
  "Spanish": "spanish",
  "medical_v2": "medical",
  "Elementary Dictionary": "sd2",
  "Intermediate Dictionary": "sd3",
  "School Dictionary": "sd4",
  "Learner's": "learners",
}

export const searchIcon = `<svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 48 48" enable-background="new 0 0 48 48" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><g fill="#616161"><rect x="34.6" y="28.1" transform="matrix(.707 -.707 .707 .707 -15.154 36.586)" width="4" height="17"></rect><circle cx="20" cy="20" r="16"></circle></g><rect x="36.2" y="32.1" transform="matrix(.707 -.707 .707 .707 -15.839 38.239)" fill="#37474F" width="4" height="12.3"></rect><circle fill="#64B5F6" cx="20" cy="20" r="13"></circle><path fill="#BBDEFB" d="M26.9,14.2c-1.7-2-4.2-3.2-6.9-3.2s-5.2,1.2-6.9,3.2c-0.4,0.4-0.3,1.1,0.1,1.4c0.4,0.4,1.1,0.3,1.4-0.1 C16,13.9,17.9,13,20,13s4,0.9,5.4,2.5c0.2,0.2,0.5,0.4,0.8,0.4c0.2,0,0.5-0.1,0.6-0.2C27.2,15.3,27.2,14.6,26.9,14.2z"></path></svg>`;

export const PAGES = {
  Search: "search",
  Result: "Result",
  Options: "Options",
  History: "History",
}

export const ERRORS = {
  EMPTY_SEARCH: "Looking up for nothing!",
  PERSONAL_KEY_NEEDED: "You've reached the limit of using public options. You need to add you FREE personal API key to continue using this extension.\n" +
    "Read the instructions on the Options page to get more info, please!",
  INVALID_API_KEY: "Invalid API options. \n" +
    "Make sure your API key is valid and the API type you choose is the same as the one you chose when you registered.",
  FAILED_TO_FETCH: "It seems you are offline!",
  NO_RESULT: "No result!",
}
