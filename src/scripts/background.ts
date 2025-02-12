import browser from "webextension-polyfill";
import {
  addToHistory,
  clearHistory, countUpPublicApiKeyUsage,
  getPublicApiKeyUsage, getReviewLinkClicksCount,
  loadHistory,
  loadOptions, removeHistoryItem,
  storeOptions, toggleHistoryItemReview
} from "../utils/storage";
import { sendMessageToCurrentTab } from "../utils/messaging";
import { GlobalActionResponseMap, GlobalActionTypes, MessageHandlerParams } from "../types";

browser.runtime.setUninstallURL("https://tally.so/r/3N7WLQ");

browser.runtime.onMessage.addListener((message: unknown) => {
  return handleMessages(message as MessageHandlerParams);
});

browser.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    port.onDisconnect.addListener(async () => {
      await sendMessageToCurrentTab({ action: GlobalActionTypes.POPUP_CLOSED });
    });
  }
});

async function handleMessages({ action, data }: MessageHandlerParams): Promise<GlobalActionResponseMap[typeof action]> {
  const options = await loadOptions();
  const history = await loadHistory();
  const publicApiUsage = await getPublicApiKeyUsage();
  const reviewLinkClicksCount = await getReviewLinkClicksCount();

  switch (action) {
    case GlobalActionTypes.INIT_CONTENT:
    case GlobalActionTypes.INIT_POPUP:

      return {
        options,
        history,
        publicApiUsage,
        reviewLinkClicksCount
      };
    case GlobalActionTypes.UPDATE_OPTIONS:
      await storeOptions({ ...options, ...data });
      await sendMessageToCurrentTab({ action: GlobalActionTypes.UPDATE_OPTIONS, data: { ...options, ...data } });
      return true;

    case GlobalActionTypes.ADD_TO_HISTORY:
      await addToHistory(data.searchTrend);
      return true;

    case GlobalActionTypes.TOGGLE_HISTORY_ITEM_REVIEW:
      return await toggleHistoryItemReview(data.key, data.review);

    case GlobalActionTypes.REMOVE_HISTORY_ITEM:
      return await removeHistoryItem(data.key);

    case GlobalActionTypes.CLEAR_HISTORY:
      await clearHistory();
      return true;

    case GlobalActionTypes.GET_PUBLIC_API_USAGE:
      return await getPublicApiKeyUsage();

    case GlobalActionTypes.COUNT_UP_PUBLIC_API_USAGE:
      return await countUpPublicApiKeyUsage();

    case GlobalActionTypes.OPEN_POPUP:
      await browser.action.openPopup();
      return true;
  }
  return true;
}

// add look up item to context menu
browser.contextMenus.create({
  title: "Look up: %s",
  contexts: ["selection"],
  id: "lookup-selection-context-menu"
});

function lookupWebsite(info: browser.Menus.OnClickData) {
  if (info.selectionText) {
    browser.tabs.create({
      url: "https://www.merriam-webster.com/dictionary/" + encodeURIComponent(info.selectionText)
    });
  }
}

browser.contextMenus.onClicked.addListener(lookupWebsite);
