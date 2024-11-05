import React, { FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { PAGES } from "../../../shared/utils/constants";
import { sendGlobalMessage, sendMessageToCurrentTab } from "../../../shared/utils/messaging";
import { services } from "../../../shared/utils/services";
import { GlobalActionTypes, LookupResult, OptionsType } from "../../../types";

type DataContextType = {
  options: OptionsType | null;
  activeSection: keyof typeof PAGES;
  publicApiUsage: number;
  reviewLinksClicksCount: number;
  countUpReviewLinksClicks: () => void;
  setOptions: (opts: Partial<OptionsType>) => void;
  setActiveSection: React.Dispatch<React.SetStateAction<keyof typeof PAGES>>;
  result: LookupResult | null;
  setResult: React.Dispatch<React.SetStateAction<LookupResult | null>>;
  searchFor: string;
  setSearchFor: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  setError: (error: Error) => void;
  loading: boolean;
  doSearch: (searchTrend: string) => void;
  suggestions: string[];
};

const DataContext = React.createContext<DataContextType | null>(null);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
};

const DataProvider: FC<PropsWithChildren> = ({ children }) => {
  const [searchFor, setSearchFor] = useState("");
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState<OptionsType | null>(null);
  const [publicApiUsage, setPublicApiUsage] = useState<number>(0);
  const [reviewLinksClicksCount, setReviewLinksClicksCount] = useState(0);
  const [activeSection, setActiveSection] = useState<keyof typeof PAGES>("Search");

  const handleSetError = useCallback((error: Error) => {
    setError(error.message || error.toString());
    setActiveSection("Search");
  }, []);

  const doSearch = useCallback((searchTrend: string) => {
    setSearchFor(searchTrend);
    setLoading(true);
    services.fetchData(searchTrend)
      .then(async (res) => {
        if (res) {
          if (typeof res[0] !== "string") {
            await sendGlobalMessage({ action: GlobalActionTypes.ADD_TO_HISTORY, data: { searchTrend } });
            setResult(res as LookupResult);
          }
          else {
            setSuggestions(res as string[]);
          }
        }
        setActiveSection("Result");
      })
      .catch(handleSetError)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    sendGlobalMessage({ action: GlobalActionTypes.POPUP_INIT }).then(async (response) => {
      services.setAuth(response.options.apiKey, response.options.apiType);
      setOptions(response.options);
      setPublicApiUsage(response.publicApiUsage);
      setReviewLinksClicksCount(response.reviewLinkClicksCount);

      sendMessageToCurrentTab({
        action: GlobalActionTypes.GET_SELECTED_TEXT,
        data: { source: "popup" }
      }).then((response) => {
        if (response?.selectedText) {
          setSearchFor(response.selectedText);
          doSearch(response.selectedText);
        }
      });
    });
  }, []);

  const handleSetOptions = (opts: Partial<OptionsType>) => {
    sendGlobalMessage({
      action: GlobalActionTypes.SET_OPTIONS,
      data: opts
    }).then((res) => {
      if (res) {
        const updatedOptions = { ...options, ...opts } as OptionsType;
        setOptions(updatedOptions);
        setActiveSection("Search");

        // update apiUtils options as well
        if (opts.apiKey && opts.apiType) {
          services.setAuth(opts.apiKey, opts.apiType);
        }
      }
    });
  };

  const countUpReviewLinksClicks = useCallback(() => {
    sendGlobalMessage({ action: GlobalActionTypes.COUNT_UP_REVIEW_LINK_CLICK }).then((count) => {
      setReviewLinksClicksCount(count);
    });
  }, [reviewLinksClicksCount]);

  const value = useMemo(() => ({
    options,
    activeSection,
    publicApiUsage,
    reviewLinksClicksCount,
    countUpReviewLinksClicks,
    setOptions: handleSetOptions,
    setActiveSection,
    result,
    setResult,
    searchFor,
    setSearchFor,
    error,
    setError: handleSetError,
    loading,
    doSearch,
    suggestions
  }), [
    options, publicApiUsage, setOptions, activeSection, setActiveSection, result,
    searchFor, setSearchFor, error, setError, doSearch, reviewLinksClicksCount,
    countUpReviewLinksClicks, suggestions
  ]);

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

export default DataProvider;
