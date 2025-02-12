import { useCallback, useEffect, useState } from "react";
import { loadHistory } from "../utils/storage";
import sortHistoryByDate from "../utils/sortHistoryByDate";
import { sendGlobalMessage } from "../utils/messaging";
import browser from "webextension-polyfill";
import {
  GlobalActionTypes,
  LookupHistory,
  MessageHandlerParams,
  ParsedHistoryArray
} from "../types";

const useGetHistory = (): [
  ParsedHistoryArray,
  (key: string, review: boolean) => void,
  (key: string) => void
] => {
  const [history, setHistory] = useState<LookupHistory>({});

  useEffect(() => {
    loadHistory().then((res) => {
      setHistory(res);
    });

    const handleMessages = (message: unknown): Promise<void> => {
      const { action } = message as MessageHandlerParams;
      if (action === GlobalActionTypes.CLEAR_HISTORY) {
        setHistory({});
      }
      return Promise.resolve();
    };

    browser.runtime.onMessage.addListener(handleMessages);
    return () => {
      browser.runtime.onMessage.removeListener(handleMessages);
    };
  }, []);

  const toggleReview = useCallback(async (key: string, review: boolean) => {
    const updatedHistory = await sendGlobalMessage({
      action: GlobalActionTypes.TOGGLE_HISTORY_ITEM_REVIEW,
      data: { key, review }
    });
    setHistory(updatedHistory);
  }, [history, setHistory]);

  const removeItem = useCallback(async (key: string) => {
    const updatedHistory = await sendGlobalMessage({ action: GlobalActionTypes.REMOVE_HISTORY_ITEM, data: { key } });
    setHistory(updatedHistory);
  }, [history, setHistory]);

  const parsedHistory = sortHistoryByDate(history);

  return [parsedHistory, toggleReview, removeItem];
};

export default useGetHistory;
