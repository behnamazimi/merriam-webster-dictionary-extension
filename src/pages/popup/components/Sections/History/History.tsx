import ActionButtons from "../../../../../shared/components/ActionButtons";
import React, { useCallback, useEffect, useState } from "react";
import { loadHistory } from "../../../../../shared/utils/storage";
import sortHistoryByDate from "../../../../../shared/utils/sortHistoryByDate";
import { services } from "../../../../../shared/utils/services";
import { sendGlobalMessage } from "../../../../../shared/utils/messaging";
import { useData } from "../../../context/data.context";
import { FiX } from "react-icons/fi";
import browser from "webextension-polyfill";
import {
  GlobalActionTypes,
  LookupHistory,
  LookupResult,
  MessageHandlerParams,
  ParsedHistoryArray
} from "../../../../../types";

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

    const handleMessages = ({ action }: MessageHandlerParams) => {
      if (action === GlobalActionTypes.CLEAR_HISTORY) {
        setHistory({});
      }
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

const History = () => {
  const { setSearchFor, setResult, setActiveSection, setError } = useData();
  const [history, toggleReview, removeItem] = useGetHistory();
  const [, setLoading] = useState(false);

  const handleReSearch = (searchTrend: string) => {
    setSearchFor(searchTrend);
    setLoading(true);
    services.fetchData(searchTrend)
      .then(async (res) => {
        if (typeof res[0] !== "string") {
          await sendGlobalMessage({ action: GlobalActionTypes.ADD_TO_HISTORY, data: { searchTrend } });
          setResult(res as LookupResult);
        }
        setActiveSection("Result");
      })
      .catch(setError)
      .finally(() => setLoading(false));
  };

  const handleHistoryCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    const textToCopy = history.map(([key]) => key).join(", ");
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        (e.target as HTMLButtonElement).innerText = "Copied!";
        (e.target as HTMLButtonElement).disabled = true;
      });
  };

  return (
    <div className="History">
      {!!history && !!history.length
        ? (
            <>
              <div className="title">Your lookup history:</div>
              <ul>
                <li className="subtitle">
                  Uncheck if you want to exclude phrases from being searched while in review mode.
                </li>
                {history.map(([key, count, review]) => (
                  <li key={key + count}>
                    <span>
                      <input
                        type="checkbox"
                        checked={review}
                        onChange={() => toggleReview(key, !review)}
                      />
                      <a onClick={() => handleReSearch(key)}>{key}</a>
                    </span>
                    <span>
                      <small>{count > 1 ? ` ${count} times` : ""}</small>
                      <button
                        title="Remove from history"
                        onClick={() => removeItem(key)}
                      >
                        <FiX />
                      </button>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )
        : <div className="no-result">No history item yet!</div>}

      <ActionButtons onHistoryCopy={handleHistoryCopy} />
    </div>
  );
};

export default History;
