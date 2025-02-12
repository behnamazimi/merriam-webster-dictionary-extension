import { MantineColorScheme } from "@mantine/core";

export type ContentIframeScreen = "LOOKUP_RESULT" | "REVIEW_PROMOTE" | "REVIEW";

export type PopupActiveSection = "Search" | "Result" | "Options" | "History";

export type IframeContext = {
  searchTrend?: string;
  targetScreen?: ContentIframeScreen;
  historySample?: string;
};

export type OptionsType = {
  apiKey: string;
  apiType: "collegiate" | "thesaurus" | "ithesaurus" | "spanish" | "medical" | "sd2" | "sd3" | "sd4" | "learners";
  isRelativeHistoryPromoted: boolean;
  pauseVideoOnPopupOpen: boolean;
  reviewMode: boolean;
  wordSelectMode: "" | "OPEN_IMMEDIATELY" | "OPEN_POPUP" | "OPEN_WITH_BUTTON" | "OPEN_ON_WEBSITE";
  theme: MantineColorScheme;
  textSize: "16px" | "18px";
};

export type HistoryObject = Record<string, { count: number; time: number; review: boolean }>;

export type LookupHistoryItem = {
  count: number;
  time: number;
  review: boolean;
};

export type LookupHistory = Record<string, LookupHistoryItem>;

export type ParsedHistoryArray = [string, number, boolean][];

export type LookupResultItem = {
  id: string;
  type: string;
  shortDef: string[];
  synonyms?: string[];
  pron: string;
  sound?: string | null;
  examples: string[];
};

export type LookupResultType = LookupResultItem[];

export enum GlobalActionTypes {
  INIT_CONTENT = "INIT_CONTENT",
  INIT_POPUP = "INIT_POPUP",
  OPEN_POPUP = "OPEN_POPUP",
  UPDATE_OPTIONS = "UPDATE_OPTIONS",
  POPUP_CLOSED = "POPUP_CLOSED",
  ADD_TO_HISTORY = "ADD_TO_HISTORY",
  TOGGLE_HISTORY_ITEM_REVIEW = "TOGGLE_HISTORY_ITEM_REVIEW",
  REMOVE_HISTORY_ITEM = "REMOVE_HISTORY_ITEM",
  CLEAR_HISTORY = "CLEAR_HISTORY",
  GET_PUBLIC_API_USAGE = "GET_PUBLIC_API_USAGE",
  COUNT_UP_PUBLIC_API_USAGE = "COUNT_UP_PUBLIC_API_USAGE",
  GET_SELECTED_TEXT = "GET_SELECTED_TEXT",
  OPEN_LOOKUP_RESULT = "OPEN_LOOKUP_RESULT",
  GET_PAGE_RELATIVE_HISTORY = "GET_PAGE_RELATIVE_HISTORY",
  MAKE_CONTENT_IFRAME_VISIBLE = "MAKE_CONTENT_IFRAME_VISIBLE",
  CLOSE_IFRAME = "CLOSE_IFRAME"
}

export type ContentInitResponse = {
  options: OptionsType;
  history: LookupHistory;
  reviewLinkClicksCount: number;
  publicApiUsage: number;
};

export type PopupInitResponse = {
  options: OptionsType;
  history: LookupHistory;
  reviewLinkClicksCount: number;
  publicApiUsage: number;
};

export type SetOptionsRequest = {
  action: GlobalActionTypes.UPDATE_OPTIONS;
  data: Partial<OptionsType>;
};

export type AddToHistoryRequest = {
  action: GlobalActionTypes.ADD_TO_HISTORY;
  data: {
    searchTrend: string;
  };
};

export type ToggleHistoryItemReviewRequest = {
  action: GlobalActionTypes.TOGGLE_HISTORY_ITEM_REVIEW;
  data: {
    key: string;
    review: boolean;
  };
};

export type ToggleHistoryItemReviewResponse = LookupHistory;

export type RemoveHistoryItemRequest = {
  action: GlobalActionTypes.REMOVE_HISTORY_ITEM;
  data: {
    key: string;
  };
};

export type RemoveHistoryItemResponse = LookupHistory;

export type OpenLookupResultRequest = {
  action: GlobalActionTypes.OPEN_LOOKUP_RESULT;
  data: {
    searchFor: string;
  };
};

export type GetSelectedTextRequest = {
  action: GlobalActionTypes.GET_SELECTED_TEXT;
  data: {
    source: "content-iframe" | "popup";
  };
};

export type GetSelectedTextResponse = {
  selectedText: string | null;
};

export type GetPageRelativeHistoryResponse = {
  pageHistory: string[];
};

export type MakeContentIframeVisibleRequest = {
  action: GlobalActionTypes.MAKE_CONTENT_IFRAME_VISIBLE;
  data: {
    targetScreen: ContentIframeScreen;
    width: number;
    height: number;
  };
};

export type CloseIframeRequest = {
  action: GlobalActionTypes.CLOSE_IFRAME;
  data: {
    targetScreen: ContentIframeScreen;
  };
};

export type GlobalActionRequestMap = {
  [GlobalActionTypes.INIT_CONTENT]: undefined;
  [GlobalActionTypes.INIT_POPUP]: undefined;
  [GlobalActionTypes.OPEN_POPUP]: undefined;
  [GlobalActionTypes.UPDATE_OPTIONS]: SetOptionsRequest;
  [GlobalActionTypes.POPUP_CLOSED]: undefined;
  [GlobalActionTypes.ADD_TO_HISTORY]: AddToHistoryRequest;
  [GlobalActionTypes.TOGGLE_HISTORY_ITEM_REVIEW]: ToggleHistoryItemReviewRequest;
  [GlobalActionTypes.REMOVE_HISTORY_ITEM]: RemoveHistoryItemRequest;
  [GlobalActionTypes.CLEAR_HISTORY]: undefined;
  [GlobalActionTypes.GET_PUBLIC_API_USAGE]: undefined;
  [GlobalActionTypes.COUNT_UP_PUBLIC_API_USAGE]: undefined;
  [GlobalActionTypes.GET_SELECTED_TEXT]: GetSelectedTextRequest;
  [GlobalActionTypes.OPEN_LOOKUP_RESULT]: OpenLookupResultRequest;
  [GlobalActionTypes.GET_PAGE_RELATIVE_HISTORY]: undefined;
  [GlobalActionTypes.MAKE_CONTENT_IFRAME_VISIBLE]: MakeContentIframeVisibleRequest;
  [GlobalActionTypes.CLOSE_IFRAME]: CloseIframeRequest;
};

export type GlobalActionResponseMap = {
  [GlobalActionTypes.INIT_CONTENT]: ContentInitResponse;
  [GlobalActionTypes.INIT_POPUP]: PopupInitResponse;
  [GlobalActionTypes.OPEN_POPUP]: boolean;
  [GlobalActionTypes.UPDATE_OPTIONS]: boolean;
  [GlobalActionTypes.POPUP_CLOSED]: boolean;
  [GlobalActionTypes.ADD_TO_HISTORY]: boolean;
  [GlobalActionTypes.TOGGLE_HISTORY_ITEM_REVIEW]: ToggleHistoryItemReviewResponse;
  [GlobalActionTypes.REMOVE_HISTORY_ITEM]: RemoveHistoryItemResponse;
  [GlobalActionTypes.CLEAR_HISTORY]: boolean;
  [GlobalActionTypes.GET_PUBLIC_API_USAGE]: number;
  [GlobalActionTypes.COUNT_UP_PUBLIC_API_USAGE]: number;
  [GlobalActionTypes.GET_SELECTED_TEXT]: GetSelectedTextResponse;
  [GlobalActionTypes.OPEN_LOOKUP_RESULT]: boolean;
  [GlobalActionTypes.GET_PAGE_RELATIVE_HISTORY]: GetPageRelativeHistoryResponse;
  [GlobalActionTypes.MAKE_CONTENT_IFRAME_VISIBLE]: boolean;
  [GlobalActionTypes.CLOSE_IFRAME]: boolean;
};

export type MessageHandlerParams = {
  [K in keyof GlobalActionRequestMap]: {
    action: K;
  } & (K extends keyof GlobalActionRequestMap ? (GlobalActionRequestMap[K] extends { data: infer D } ? { data: D } : { data: never }) : { data: never })
}[keyof GlobalActionRequestMap];
