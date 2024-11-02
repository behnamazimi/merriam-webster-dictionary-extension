import browser from "webextension-polyfill";
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

console.log("Hello from the background!");

browser.runtime.setUninstallURL("https://tally.so/r/3N7WLQ");

browser.runtime.onMessage.addListener(handleMessages)

browser.runtime.onConnect.addListener((port) => {
  if (port.name === "popup") {
    port.onDisconnect.addListener(async () => {
      await sendMessageToCurrentTab({action: globalActions.ON_POPUP_CLOSE})
    });
  }
});

browser.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, {oldValue, newValue}] of Object.entries(changes)) {
    console.log(
      `Storage key "${key}" in namespace "${namespace}" changed.`,
      `Old value was "${JSON.stringify(oldValue)}", new value is "${JSON.stringify(newValue)}".`
    );
  }
});

async function handleMessages(data: { action: keyof typeof globalActions, [key: string]: any }) {
  console.log({data});
  const options = await loadOptions();
  switch (data.action) {
    case globalActions.INIT:
    case globalActions.POPUP_INIT:
      const history = await loadHistory();
      const publicApiUsage = await getPublicApiKeyUsage();
      const reviewLinkClicksCount = await getReviewLinkClicksCount();

      console.log("history", history)
      return {
        options,
        history,
        publicApiUsage,
        reviewLinkClicksCount
      };
    case globalActions.SET_OPTIONS:
      data.options = {...options, ...data.options}
      await storeOptions(data.options);
      await sendMessageToCurrentTab(data);
      return true;

    case globalActions.ADD_TO_HISTORY:
      console.log(data.searchTrend);
      await addToHistory(data.searchTrend);
      return true;

    case globalActions.TOGGLE_HISTORY_REVIEW:
      await toggleHistoryItemReview(data.key, data.review);
      return true;

    case globalActions.REMOVE_HISTORY_ITEM:
      await removeHistoryItem(data.key);
      return true;

    case globalActions.CLEAR_HISTORY:
      await clearHistory();
      return true;

    case globalActions.GET_PUBLIC_API_USAGE:
      await getPublicApiKeyUsage();
      return true;

    case globalActions.COUNT_UP_PUBLIC_API_USAGE:
      await countUpPublicApiKeyUsage();
      return true;

    case globalActions.COUNT_UP_REVIEW_LINK_CLICK:
      await countUpReviewLinkClicks();
      return true;

    case globalActions.OPEN_POPUP:
      return await browser.action.openPopup();
  }
  return true;
}

// add look up item to context menu
browser.contextMenus.create({
  title: "Look up: %s",
  contexts: ["selection"],
  id: "lookup-selection-context-menu"
});

function lookupWebsite(info) {
  browser.tabs.create({
    url: "https://www.merriam-webster.com/dictionary/" + encodeURIComponent(info.selectionText)
  });
}

browser.contextMenus.onClicked.addListener(lookupWebsite)
