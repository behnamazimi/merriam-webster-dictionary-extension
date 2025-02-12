import { services } from "../utils/services";
import { sendGlobalMessage } from "../utils/messaging";
import browser from "webextension-polyfill";
import ContentIFrameManager from "../utils/ContentIframeManager";
import UserTextManager from "../utils/UserTextManager";
import FloatingButtonManager from "../utils/FloatingButtonManager";
import simplifyingGettingApiKeySteps from "../utils/simplifyingGettingApiKeySteps";
import getPageRelativeHistory from "../utils/getPageRelativeHistory";
import "../ui/index.scss";
import {
  OptionsType,
  LookupHistory,
  GlobalActionTypes,
  GlobalActionResponseMap,
  MessageHandlerParams
} from "../types";

let lookupResultIframe: ContentIFrameManager;
let historyReviewIframe: ContentIFrameManager;
let reviewPromoteIframe: ContentIFrameManager;
let userTextManager: UserTextManager;
let floatingButtonManager: FloatingButtonManager;
let lastPlayingVideo: HTMLVideoElement | null = null;

const initStyles = () => {
  const style = document.createElement("style");
  style.innerHTML = `
    
  `;
  document.head.appendChild(style);
};

let options: OptionsType | null = null;
let history: LookupHistory | null = null;
console.log("mwd content script loaded");

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("mouseup", handleMouseUp);
browser.runtime.onMessage.addListener(handleMessages);

const onFloatingButtonClick = async () => {
  if (!options) {
    return;
  }

  const selectedText = userTextManager.getSelectedTextIfValid();
  if (options.wordSelectMode === "OPEN_ON_WEBSITE") {
    window.open(`https://www.merriam-webster.com/dictionary/${selectedText}`);
  }
  else if (options.wordSelectMode === "OPEN_POPUP") {
    await sendGlobalMessage({
      action: GlobalActionTypes.OPEN_POPUP
    });
  }
  else if (options.wordSelectMode === "OPEN_WITH_BUTTON") {
    lookupResultIframe.createIfNotExists();
  }
  floatingButtonManager.remove();
};

async function init() {
  const response = await sendGlobalMessage<GlobalActionTypes.INIT_CONTENT>({ action: GlobalActionTypes.INIT_CONTENT });
  // set api key and type in utils
  services.setAuth(response.options.apiKey, response.options.apiType);
  options = response.options;
  history = response.history;

  if (!options) {
    console.error("Options not found");
    return;
  }

  initStyles();
  lookupResultIframe = new ContentIFrameManager("mwd-lookup-result-iframe");
  historyReviewIframe = new ContentIFrameManager("mwd-review-iframe");
  reviewPromoteIframe = new ContentIFrameManager("review-promote-iframe");
  userTextManager = UserTextManager.getInstance();
  floatingButtonManager = FloatingButtonManager.getInstance();
  floatingButtonManager.onClick = onFloatingButtonClick;

  const pageText = document.body.innerText.toLowerCase();
  const pageHistory = getPageRelativeHistory(history, pageText);
  if (!options.reviewMode && !options.isRelativeHistoryPromoted && pageHistory.length) {
    reviewPromoteIframe.createIfNotExists({ targetScreen: "REVIEW_PROMOTE", historySample: pageHistory[0] });
  }
  else if (options.reviewMode && pageHistory.length) {
    historyReviewIframe.createIfNotExists({ targetScreen: "REVIEW" });
  }

  // manipulate dictionaryapi website to make it easy to get API keys
  simplifyingGettingApiKeySteps();
}

async function handleMouseUp(event: MouseEvent) {
  if (!options || reviewPromoteIframe.doesExist()) {
    return;
  }

  // remove lookup result iframe if it exists
  lookupResultIframe.remove();

  const selectedText = userTextManager.getSelectedTextIfValid();
  if (!selectedText) {
    floatingButtonManager.remove();
    return;
  }
  if (options.wordSelectMode === "OPEN_IMMEDIATELY") {
    lookupResultIframe.createIfNotExists();
  }
  else if (options.wordSelectMode) {
    // handle cases for floating button

    if (floatingButtonManager.getElement()?.contains(event.target as Node)) {
      event.preventDefault();
    }
    else {
      floatingButtonManager.create(event);
    }
  }
}

async function handleMessages(message: unknown): Promise<GlobalActionResponseMap[typeof action]> {
  const { action, data } = message as MessageHandlerParams;

  if (!action) {
    return false;
  }

  if (action === GlobalActionTypes.GET_SELECTED_TEXT) {
    const selectedText = userTextManager.getSelectedTextIfValid();

    // Pause video if it's playing and the popup is opened from the user
    const fromPopup = data.source === "popup";
    if (fromPopup && !lookupResultIframe.doesExist()) {
      if (!lastPlayingVideo && options?.pauseVideoOnPopupOpen) {
        document.querySelectorAll("video").forEach((video) => {
          if (video.duration > 1 && !video.paused) {
            lastPlayingVideo = video;
            video.pause();
          }
        });
      }
    }
    return {
      selectedText
    };
  }

  if (action === GlobalActionTypes.OPEN_LOOKUP_RESULT) {
    lookupResultIframe.remove();
    lookupResultIframe.createIfNotExists({ searchTrend: data.searchFor });
    return true;
  }

  if (action === GlobalActionTypes.GET_PAGE_RELATIVE_HISTORY) {
    const pageText = document.body.innerText.toLowerCase();
    const pageHistory = getPageRelativeHistory(history, pageText);
    return {
      pageHistory
    };
  }

  if (action === GlobalActionTypes.POPUP_CLOSED && lastPlayingVideo) {
    lastPlayingVideo.play();
    lastPlayingVideo = null;
  }
  else if (action === GlobalActionTypes.UPDATE_OPTIONS) {
    options = {
      ...options,
      ...data
    } as OptionsType;
    // set api key and type in utils
    services.setAuth(options.apiKey, options.apiType);

    if (data.reviewMode) {
      historyReviewIframe.createIfNotExists({ targetScreen: "REVIEW" });
    }
    else {
      // remove review iframe if review mode is disabled
      historyReviewIframe.remove();
    }
  }

  if (action === GlobalActionTypes.MAKE_CONTENT_IFRAME_VISIBLE) {
    const { targetScreen, ...rest } = data;
    const iframeDimension = {
      width: Number(rest.width),
      height: Number(rest.height)
    };
    // to show lookup result iframe based on selected text position
    const selectedTextRect = userTextManager.getBoundingClientRect();

    // to show lookup result iframe based on review bar position
    const reviewBarRect = historyReviewIframe.getElement()?.getBoundingClientRect();
    switch (targetScreen) {
      case "REVIEW":
        historyReviewIframe.show(iframeDimension);
        break;
      case "REVIEW_PROMOTE":
        reviewPromoteIframe.show(iframeDimension);
        break;
      case "LOOKUP_RESULT":
        lookupResultIframe.show(iframeDimension, selectedTextRect || reviewBarRect);
        break;
    }
    return true;
  }

  if (action === GlobalActionTypes.CLOSE_IFRAME) {
    const { targetScreen } = data;
    switch (targetScreen) {
      case "REVIEW":
        historyReviewIframe.remove();
        break;
      case "REVIEW_PROMOTE":
        reviewPromoteIframe.remove();
        break;
      case "LOOKUP_RESULT":
        lookupResultIframe.remove();
        break;
    }
    return true;
  }

  return true;
}
