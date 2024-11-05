import cx from "classnames";
import {FC, useCallback, useEffect, useState} from "react";
import {services} from "../../shared/utils/services";
import {globalActions} from "../../shared/utils/constants";
import {sendGlobalMessage, sendMessageToCurrentTab} from "../../shared/utils/messaging";
import BubbleResult from "../../components/BubbleResult/BubbleResult";
import BubbleSuggestionList from "../../components/BubbleResult/BubbleSuggestionList";
import "./Bubble.css";
import {LookupResult} from "../../types";

interface MessageData {
  action: string;
  data: {
    selectedText?: string;
  };
}

const fitIframeToContent = () => {
  sendMessageToCurrentTab({
    action: globalActions.MAKE_CONTENT_IFRAME_VISIBLE,
    data: {
      targetScreen: "LOOKUP_RESULT",
      width: 400,
      height: document.body.scrollHeight,
    }
  })
}

const Bubble: FC<{ defaultSearchTrend?: string }> = ({defaultSearchTrend}) => {
  const [searchFor, setSearchFor] = useState<string>("");
  const [result, setResult] = useState<LookupResult>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const doSearch = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await services.fetchData(searchFor);
      if (res) {
        if (typeof res[0] !== "string") {
          await sendGlobalMessage({action: globalActions.ADD_TO_HISTORY, searchTrend: searchFor});
          setResult(res as LookupResult);
        } else {
          setSuggestions(res as string[]);
        }
      }
    } catch (err) {
      // @ts-expect-error Parameter 'err' implicitly has an 'any' type.
      setError(err.message || String(err));
    } finally {
      setTimeout(fitIframeToContent, 100)
      setLoading(false);
    }
  }, [searchFor]);

  useEffect(() => {
    if (!defaultSearchTrend) {
      sendMessageToCurrentTab({action: globalActions.GET_SELECTED_TEXT}).then(({data}: MessageData) => {
        setSearchFor(data.selectedText || "");
      });
    } else {
      setSearchFor(defaultSearchTrend);
    }
  }, []);

  useEffect(() => {
    if (searchFor) {
      doSearch();
    }
  }, [searchFor, doSearch]);

  const showSuggestionList = suggestions.length > 0;
  const showResult = !showSuggestionList && !loading && !error;

  return (
    <div className={cx("Bubble", {loaded: !loading})}>
      {showResult && <BubbleResult result={result} searchFor={searchFor}/>}
      {showSuggestionList && (
        <BubbleSuggestionList
          onReSearch={doSearch}
          searchFor={searchFor}
          suggestions={suggestions}
        />
      )}
      {loading && <div className="loading">Loading...</div>}
      {error && <div className="message">{error}</div>}
    </div>
  );
};

export default Bubble;
