import { defaultOptions } from "../constants/constants";
import browser from "webextension-polyfill";
import { HistoryObject, OptionsType } from "../types";

export async function storeOptions(data: OptionsType) {
  return browser.storage.sync.set({ options: data });
}

export async function loadOptions(): Promise<OptionsType> {
  const data = await browser.storage.sync.get("options");
  return (data.options || defaultOptions) as OptionsType;
}

export async function loadHistory(): Promise<HistoryObject> {
  const data = await browser.storage.local.get("history");
  return (data.history || {}) as HistoryObject;
}

export async function addToHistory(search: string) {
  const history = await loadHistory();

  // add if not exist
  if (!history[search]) {
    history[search] = { count: 0, time: Date.now(), review: true };
  }
  history[search].count++;
  history[search].time = Date.now();

  return browser.storage.local.set({ history });
}

export async function removeHistoryItem(key: string) {
  const history = await loadHistory();
  delete history[key];
  await browser.storage.local.set({ history });
  return await loadHistory();
}

export async function toggleHistoryItemReview(key: string, review: boolean) {
  const history = await loadHistory();
  if (!history[key]) {
    return history;
  }

  history[key].review = review;
  await browser.storage.local.set({ history });
  return history;
}

export async function clearHistory() {
  return await browser.storage.local.set({ history: {} });
}

export async function getPublicApiKeyUsage(): Promise<number> {
  const data = await browser.storage.sync.get("publicApiUsage");
  return Number(data.publicApiUsage) || 0;
}

export async function countUpPublicApiKeyUsage() {
  const currentUsage = await getPublicApiKeyUsage();
  const publicApiUsage = currentUsage + 1;
  await browser.storage.sync.set({ publicApiUsage });
  return publicApiUsage;
}

export async function getReviewLinkClicksCount() {
  const data = await browser.storage.sync.get("reviewLinkClicksCount");
  return Number(data.reviewLinkClicksCount) || 0;
}
