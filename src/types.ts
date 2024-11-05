type MessageAction = "GET_SELECTED_TEXT";

export type MessagePayload = {
  action: MessageAction;
  data?: string;
};

export type MessageResponseCallback = (_p: MessagePayload) => void;

export type ContentIframeScreen = "LOOKUP_RESULT" | "REVIEW_PROMOTE" | "REVIEW";

export type IframeContext = {
  searchTrend?: string;
  targetScreen?: ContentIframeScreen;
  historySample?: string;
}

export type OptionsType = {
  apiKey: string;
  apiType: "collegiate" | "thesaurus" | "ithesaurus" | "spanish" | "medical" | "sd2" | "sd3" | "sd4" | "learners";
  isRelativeHistoryPromoted: boolean;
  pauseVideoOnPopupOpen: boolean;
  reviewMode: boolean;
  wordSelectMode: "" | "OPEN_IMMEDIATELY" | "OPEN_POPUP" | "OPEN_WITH_BUTTON" | "OPEN_ON_WEBSITE";
}


export type LookupHistoryItem = {
  count: number,
  time: number,
  review: boolean
}

export type LookupHistory = Record<string, LookupHistoryItem>

export type LookupResultItem ={
  id: string;
  type: string;
  shortDef: string[];
  synonyms?: string[];
  pron: string;
  sound?: string | null;
  examples: string[];
}

export type LookupResult = LookupResultItem[]