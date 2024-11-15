import React, { useCallback, useEffect, useState } from "react";
import { services } from "../../../utils/services";
import { sendGlobalMessage, sendMessageToCurrentTab } from "../../../utils/messaging";
import { GlobalActionTypes, LookupResultType, OptionsType } from "../../../types";
import LookupResult from "../../components/LookupResult/LookupResult";
import LookupResultSuggestions from "../../components/LookupResult/LookupResultSuggestions";
import { Box, Loader, Text } from "@mantine/core";

const fitIframeToContent = (textSize?: OptionsType["textSize"]) => {
  let width = 400;
  if (textSize === "18px") {
    width = 430;
  }

  sendMessageToCurrentTab({
    action: GlobalActionTypes.MAKE_CONTENT_IFRAME_VISIBLE,
    data: {
      targetScreen: "LOOKUP_RESULT",
      width,
      height: document.body.scrollHeight
    }
  });
};

type ContentBubbleProps = {
  defaultSearchTrend?: string;
  textSize?: OptionsType["textSize"];
};

// TODO: Fix Vite HMR with named function components and name this component properly
// eslint-disable-next-line react/display-name
export default function ({ defaultSearchTrend, textSize }: ContentBubbleProps) {
  const [searchFor, setSearchFor] = useState<string>("");
  const [result, setResult] = useState<LookupResultType>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const doSearch = useCallback(async () => {
    setLoading(true);
    setError("");
    setResult([]);
    setSuggestions([]);
    try {
      const res = await services.fetchData(searchFor);
      if (res) {
        if (typeof res[0] !== "string") {
          await sendGlobalMessage({ action: GlobalActionTypes.ADD_TO_HISTORY, data: { searchTrend: searchFor } });
          setResult(res as LookupResultType);
        }
        else {
          setSuggestions(res as string[]);
        }
      }
    }
    catch (err) {
      // @ts-expect-error Parameter 'err' implicitly has an 'any' type.
      setError(err.message || String(err));
    }
    finally {
      setTimeout(() => fitIframeToContent(textSize), 100);
      setLoading(false);
    }
  }, [searchFor]);

  useEffect(() => {
    if (!defaultSearchTrend) {
      sendMessageToCurrentTab({ action: GlobalActionTypes.GET_SELECTED_TEXT, data: { source: "content-iframe" } }).then((data) => {
        if (data?.selectedText) {
          setSearchFor(data.selectedText);
        }
      });
    }
    else {
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
    <Box p="xs" mah={textSize === "16px" ? "220px" : "260px"} style={{ overflow: "auto" }}>
      {showResult && <LookupResult result={result} searchFor={searchFor} />}
      {showSuggestionList && (
        <LookupResultSuggestions
          onReSearch={doSearch}
          searchFor={searchFor}
          suggestions={suggestions}
        />
      )}
      {loading && <Loader type="dots" size="lg" />}
      {error && <Text c="red">{error}</Text>}
    </Box>
  );
};
