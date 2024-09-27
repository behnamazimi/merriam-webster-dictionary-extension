// 'use strict';
import {
  addToHistory,
  clearHistory, countUpPublicApiKeyUsage, countUpReviewLinkClicks,
  getPublicApiKeyUsage, getReviewLinkClicksCount,
  loadHistory,
  loadOptions, removeHistoryItem,
  storeOptions, toggleHistoryItemReview
} from "./shared/utils/storage";
import {globalActions} from "./shared/utils/constants";
import {sendMessageToCurrentTab} from "./shared/utils/messaging";

chrome.runtime.setUninstallURL("https://tally.so/r/3N7WLQ");

chrome.runtime.onMessage.addListener(handleMessages)

chrome.runtime.onConnect.addListener(function (port) {
  if (port.name === "popup") {
    port.onDisconnect.addListener(function () {
      sendMessageToCurrentTab({action: globalActions.ON_POPUP_CLOSE}, () => {
        console.log("ON_POPUP_CLOSE");
      })
    });
  }
});

function handleMessages(data, details, sendResponse) {
  switch (data.action) {
    case globalActions.INIT:
    case globalActions.POPUP_INIT:
      loadOptions((options) => {
        loadHistory((history) => {
          getPublicApiKeyUsage((publicApiUsage) => {
            getReviewLinkClicksCount((reviewLinkClicksCount) => {
              sendResponse({
                options,
                history,
                publicApiUsage,
                reviewLinkClicksCount
              });
            })
          })
        })
      })
      break;
    case globalActions.SET_OPTIONS:
      loadOptions(prevOptions => {
        data.options = {...prevOptions, ...data.options}
        storeOptions(data.options, (res) => {
          sendMessageToCurrentTab(data);
          sendResponse(res);
        });
      })
      break;

    case globalActions.ADD_TO_HISTORY:
      addToHistory(data.searchTrend, () => {
        sendResponse(true);
      });
      break;

    case globalActions.TOGGLE_HISTORY_REVIEW:
      toggleHistoryItemReview(data.key, data.review, (history) => {
        sendResponse(history);
      });
      break;

    case globalActions.REMOVE_HISTORY_ITEM:
      removeHistoryItem(data.key, (history) => {
        sendResponse(history);
      });
      break;

    case globalActions.CLEAR_HISTORY:
      clearHistory(() => {
        sendMessageToCurrentTab(data);
        sendResponse(true);
      });
      break;

    case globalActions.GET_PUBLIC_API_USAGE:
      getPublicApiKeyUsage(sendResponse);
      break;

    case globalActions.COUNT_UP_PUBLIC_API_USAGE:
      countUpPublicApiKeyUsage(sendResponse);
      break;

    case globalActions.COUNT_UP_REVIEW_LINK_CLICK:
      countUpReviewLinkClicks(sendResponse);
      break;

    case globalActions.OPEN_POPUP:
      chrome.action.openPopup();
      break;
  }
  return true;
}

// add look up item to context menu
chrome.contextMenus.create({
  title: "Look up: %s",
  contexts: ["selection"],
  id: "lookup-selection-context-menu"
});

function lookupWebsite(info) {
  chrome.tabs.create({
    url: "https://www.merriam-webster.com/dictionary/" + encodeURIComponent(info.selectionText)
  });
}

chrome.contextMenus.onClicked.addListener(lookupWebsite)
