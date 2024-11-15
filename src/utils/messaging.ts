import browser from "webextension-polyfill";
import { GlobalActionRequestMap, GlobalActionResponseMap } from "../types";

type MessageBody<T extends keyof GlobalActionRequestMap> = {
  action: T;
} & (T extends keyof GlobalActionRequestMap ? (GlobalActionRequestMap[T] extends { data: infer D } ? { data: D } : object) : object);

export async function sendMessageToCurrentTab<T extends keyof GlobalActionRequestMap>(body: MessageBody<T>): Promise<
  GlobalActionResponseMap[T] | null
> {
  const tabs = await browser.tabs.query({ currentWindow: true, active: true });
  if (tabs && tabs[0]?.id) {
    try {
      return await browser.tabs.sendMessage(tabs[0].id, body);
    }
    catch {
      return null;
    }
  }

  return null;
}

export async function sendGlobalMessage<T extends keyof GlobalActionRequestMap>(
  body: MessageBody<T>
): Promise<GlobalActionResponseMap[T]> {
  return await browser.runtime.sendMessage(body);
}
