import {services} from "./shared/utils/services";
import {
  globalActions,
} from "./shared/utils/constants";
import {sendGlobalMessage} from "./shared/utils/messaging";
import browser from "webextension-polyfill";
import ContentIFrameManager from "./ContentIframeManager";
import UserTextManager from "./UserTextManager";
import FloatingButtonManager from "./FloatingButtonManager";
import simplifyingGettingApiKeySteps from "./shared/utils/simplifyingGettingApiKeySteps";
import getPageRelativeHistory from "./shared/utils/getPageRelativeHistory";
import "./pages/content/content.scss";
import {OptionsType, LookupHistory} from "./types";

let lookupResultIframe: ContentIFrameManager;
let historyReviewIframe: ContentIFrameManager;
let reviewPromoteIframe: ContentIFrameManager;
let userTextManager: UserTextManager;
let floatingButtonManager: FloatingButtonManager;
let lastPlayingVideo: HTMLVideoElement | null = null;

const initStyles = () => {
  const style = document.createElement("style");
  style.innerHTML = `
    .mwd-iframe {
      position: fixed;
      top: 50%;
      left: 50%;
      width: 670px;
      z-index: 9999999999999;
      visibility: hidden;
      opacity: 0;
      height: auto;
      min-height: 348px;
      border-radius: 8px;
      transform: translate(-50%, -50%) scale(0);
      border: 1px solid #e2e8f0;
      background-color: white;
      animation: iframeAnimation 0.25s forwards;
    }

    .mwd-iframe.visible {
      animation: iframeShow 0.25s forwards;
    }

    @keyframes iframeAnimation {
      from {
        transform: translate(-50%, -10%) scale(0);
        opacity: 0;
        visibility: hidden;
      }
      to {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
        visibility: visible;
      }
    }

    @keyframes iframeShow {
      from {
        transform: translate(-50%, -10%) scale(0);
        opacity: 0;
        visibility: hidden;
      }
      to {
        transform: translate(-50%, -50%) scale(1);
        opacity: 1;
        visibility: visible;
      }
    }
  `;
  document.head.appendChild(style);
};

let options: OptionsType | null = null
let history: LookupHistory | null = null
console.log("Content script loaded");

window.addEventListener("DOMContentLoaded", init)
window.addEventListener("mouseup", handleMouseUp)
browser.runtime.onMessage.addListener(handleMessages)

const onFloatingButtonClick = async () => {
  if (!options) {
    return
  }

  const selectedText = userTextManager.getSelectedTextIfValid();
  if (options.wordSelectMode === "OPEN_ON_WEBSITE") {
    window.open(`https://www.merriam-webster.com/dictionary/${selectedText}`)
  } else if (options.wordSelectMode === "OPEN_POPUP") {
    await sendGlobalMessage({
      action: globalActions.OPEN_POPUP,
    })
  } else if (options.wordSelectMode === "OPEN_WITH_BUTTON") {
    lookupResultIframe.createIfNotExists()
  }
  floatingButtonManager.remove();
}

async function init() {
  const response = await sendGlobalMessage({action: globalActions.INIT});
  // set api key and type in utils
  services.setAuth(response.options.apiKey, response.options.apiType)
  options = response.options
  history = response.history

  if (!options) {
    console.error("Options not found")
    return
  }

  initStyles();
  lookupResultIframe = new ContentIFrameManager("mwd-lookup-result-iframe");
  historyReviewIframe = new ContentIFrameManager("mwd-review-iframe");
  reviewPromoteIframe = new ContentIFrameManager("review-promote-iframe");
  userTextManager = UserTextManager.getInstance();
  floatingButtonManager = FloatingButtonManager.getInstance();
  floatingButtonManager.onClick = onFloatingButtonClick

  const pageText = document.body.innerText.toLowerCase()
  const pageHistory = getPageRelativeHistory(history, pageText)
  if (!options.reviewMode && !options.isRelativeHistoryPromoted && pageHistory.length) {
    reviewPromoteIframe.createIfNotExists({targetScreen: "REVIEW_PROMOTE", historySample: pageHistory[0]})

  } else if (options.reviewMode && pageHistory.length) {
    historyReviewIframe.createIfNotExists({targetScreen: "REVIEW"})
  }

  // manipulate dictionaryapi website to make it easy to get API keys
  simplifyingGettingApiKeySteps();
}

async function handleMouseUp(event: MouseEvent) {
  if (!options || reviewPromoteIframe.doesExist()) {
    return
  }
  const selectedText = userTextManager.getSelectedTextIfValid();
  if (!selectedText) {
    lookupResultIframe.remove();
    floatingButtonManager.remove();
    return;
  }
  if (options.wordSelectMode === "OPEN_IMMEDIATELY") {
    lookupResultIframe.createIfNotExists()
  } else if (!!options.wordSelectMode) {
    // handle cases for floating button

    if (floatingButtonManager.getElement()?.contains(event.target as Node)) {
      event.preventDefault();
    } else {
      floatingButtonManager.create(event)
    }
  }
}

async function handleMessages({action, data = {}}: {
  action: keyof typeof globalActions, data: {
    [key: string]: any
  }
}) {

  if (action === globalActions.GET_SELECTED_TEXT) {
    const selectedText = userTextManager.getSelectedTextIfValid();

    // Pause video if it's playing and the popup is opened from the user
    const fromPopup = data.source === "popup"
    if (fromPopup && !lookupResultIframe.doesExist()) {
      if (!lastPlayingVideo && options?.pauseVideoOnPopupOpen) {
        document.querySelectorAll("video").forEach((video) => {
          if (video.duration > 1 && !video.paused) {
            lastPlayingVideo = video;
            video.pause()
          }
        })
      }
    }
    return {
      data: {selectedText}
    }
  }

  if (action === globalActions.OPEN_LOOKUP_RESULT) {
    lookupResultIframe.createIfNotExists({searchTrend: data.searchFor})
    return true
  }

  if (action === globalActions.GET_PAGE_RELATIVE_HISTORY) {
    const pageText = document.body.innerText.toLowerCase()
    const pageHistory = getPageRelativeHistory(history, pageText)
    return {
      data: {pageHistory}
    }
  }

  if (action === globalActions.ON_POPUP_CLOSE && lastPlayingVideo) {
    lastPlayingVideo.play()
    lastPlayingVideo = null

  } else if (action === globalActions.SET_OPTIONS) {
    options = {
      ...options,
      ...data
    } as OptionsType
    // set api key and type in utils
    services.setAuth(options.apiKey, options.apiType)
  }

  if (action === globalActions.MAKE_CONTENT_IFRAME_VISIBLE) {
    const {targetScreen, ...rest} = data
    const iframeDimension = {
      width: Number(rest.width),
      height: Number(rest.height)
    }
    switch (targetScreen) {
      case "REVIEW_PROMOTE":
        reviewPromoteIframe.show(iframeDimension)
        break
      case "REVIEW":
        historyReviewIframe.show(iframeDimension)
        break
      case "LOOKUP_RESULT":
        // to show lookup result iframe based on selected text position
        const selectedTextRect = userTextManager.getBoundingClientRect();

        // to show lookup result iframe based on review bar position
        const reviewBarRect = historyReviewIframe.getElement()?.getBoundingClientRect();
        lookupResultIframe.show(iframeDimension, selectedTextRect || reviewBarRect)
        break
    }
  }

  if (data.closeReviewPromotion) {
    reviewPromoteIframe.remove()
  }

  return true
}
