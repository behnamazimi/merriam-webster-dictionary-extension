import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  ReactNode, useMemo
} from "react";
import { sendGlobalMessage, sendMessageToCurrentTab } from "../utils/messaging";
import { services } from "../utils/services";
import { GlobalActionTypes, LookupResultType, OptionsType, PopupActiveSection } from "../types";

// Separate contexts for each distinct piece of state or logic group
const OptionsContext = createContext<{
  options: OptionsType | null;
  setOptions: (opts: Partial<OptionsType>) => void;
  publicApiUsage: number;
} | null>(null);

const SearchContext = createContext<{
  searchFor: string;
  setSearchFor: React.Dispatch<React.SetStateAction<string>>;
  result: LookupResultType | null;
  setResult: React.Dispatch<React.SetStateAction<LookupResultType | null>>;
  suggestions: string[];
  setSuggestions: React.Dispatch<React.SetStateAction<string[]>>;
  loading: boolean;
  doSearch: (searchTrend: string) => void;
  error: string;
  setError: (error: Error | null) => void;
} | null>(null);

const ActiveSectionContext = createContext<{
  activeSection: PopupActiveSection;
  setActiveSection: React.Dispatch<React.SetStateAction<PopupActiveSection>>;
} | null>(null);

// Custom hooks for easy access to each context
export const useOptions = () => {
  const context = useContext(OptionsContext);
  if (!context) throw new Error("useOptions must be used within a DataProvider");
  return context;
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within a DataProvider");
  return context;
};

export const useActiveSection = () => {
  const context = useContext(ActiveSectionContext);
  if (!context) throw new Error("useActiveSection must be used within a DataProvider");
  return context;
};

// Provider component
const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchFor, setSearchFor] = useState("");
  const [error, setError] = useState<string>("");
  const [result, setResult] = useState<LookupResultType | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptionsState] = useState<OptionsType | null>(null);
  const [publicApiUsage, setPublicApiUsage] = useState<number>(0);
  const [activeSection, setActiveSection] = useState<PopupActiveSection>("Search");

  useEffect(() => {
    setError("");
  }, [activeSection]);

  const setErrorMessage = useCallback((error: Error | null) => {
    setError(error ? error.message : "");
    setActiveSection("Search");
  }, []);

  const doSearch = useCallback(async (searchTrend: string) => {
    setSearchFor(searchTrend);
    setLoading(true);
    try {
      const res = await services.fetchData(searchTrend);
      if (Array.isArray(res) && typeof res[0] === "string") {
        setSuggestions(res as string[]);
      }
      else {
        setResult(res as LookupResultType);
        await sendGlobalMessage({ action: GlobalActionTypes.ADD_TO_HISTORY, data: { searchTrend } });
      }
      setActiveSection("Result");
    }
    catch (err) {
      setErrorMessage(err as Error);
    }
    finally {
      setLoading(false);
    }
  }, []);

  const handleSetOptions = useCallback((opts: Partial<OptionsType>) => {
    sendGlobalMessage({
      action: GlobalActionTypes.UPDATE_OPTIONS,
      data: opts
    }).then((res) => {
      if (res) {
        const updatedOptions = { ...options, ...opts } as OptionsType;
        setOptionsState(updatedOptions);

        if (opts.apiKey && opts.apiType) {
          services.setAuth(opts.apiKey, opts.apiType);
        }
      }
    });
  }, [options]);

  useEffect(() => {
    const initializePopup = async () => {
      const response = await sendGlobalMessage({ action: GlobalActionTypes.INIT_POPUP });
      services.setAuth(response.options.apiKey, response.options.apiType);
      setOptionsState(response.options);
      setPublicApiUsage(response.publicApiUsage);

      const selectedTextResponse = await sendMessageToCurrentTab({
        action: GlobalActionTypes.GET_SELECTED_TEXT,
        data: { source: "popup" }
      });
      if (selectedTextResponse?.selectedText) {
        setSearchFor(selectedTextResponse.selectedText);
        doSearch(selectedTextResponse.selectedText);
      }
    };
    initializePopup();
  }, [doSearch]);

  const optionsContextValue = useMemo(() => ({
    options,
    setOptions: handleSetOptions,
    publicApiUsage
  }), [options, handleSetOptions, publicApiUsage]);

  const searchContextValue = useMemo(() => ({
    searchFor,
    setSearchFor,
    result,
    setResult,
    suggestions,
    setSuggestions,
    loading,
    doSearch,
    error,
    setError: setErrorMessage
  }), [searchFor, setSearchFor, result, setResult, suggestions, setSuggestions, loading, doSearch, error, setErrorMessage]);

  const activeSectionContextValue = useMemo(() => ({
    activeSection,
    setActiveSection
  }), [activeSection, setActiveSection]);

  return (
    <OptionsContext.Provider value={optionsContextValue}>
      <SearchContext.Provider value={searchContextValue}>
        <ActiveSectionContext.Provider value={activeSectionContextValue}>
          {children}
        </ActiveSectionContext.Provider>
      </SearchContext.Provider>
    </OptionsContext.Provider>
  );
};

export default DataProvider;
