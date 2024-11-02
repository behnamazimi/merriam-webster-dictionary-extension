import browser from "webextension-polyfill";

export async function sendMessageToCurrentTab(body: Record<string, any>) {
  const tabs = await browser.tabs.query({currentWindow: true, active: true});
  if (tabs && tabs[0]?.id) {
    return await browser.tabs.sendMessage(tabs[0].id, body);
  }

  return null;
}

export async function sendGlobalMessage(body: Record<string, any>) {
  return await browser.runtime.sendMessage(body);
}