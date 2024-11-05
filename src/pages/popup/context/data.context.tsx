import React, {FC, PropsWithChildren, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {globalActions, PAGES} from "../../../shared/utils/constants";
import {sendGlobalMessage, sendMessageToCurrentTab} from "../../../shared/utils/messaging";
import {services} from "../../../shared/utils/services";
import {LookupResult, OptionsType} from "../../../types";

type DataContextType = {
  options: any
  activeSection: keyof typeof PAGES
  publicApiUsage: any
  reviewLinksClicksCount: number
  countUpReviewLinksClicks: () => void
  setOptions: (opts: any) => void
  setActiveSection: (section: keyof typeof PAGES) => void
  result: LookupResult | null
  setResult: (res: LookupResult) => void
  searchFor: string
  setSearchFor: (searchTrend: string) => void
  error: Error | string
  setError: (error: Error) => void
  loading: boolean
  doSearch: (searchTrend: string) => void
  suggestions: string[]
}

const DataContext = React.createContext<DataContextType | null>(null)

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

const DataProvider: FC<PropsWithChildren> = ({children}) => {
  const [searchFor, setSearchFor] = useState("");
  const [error, setError] = useState<Error | string>("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({});
  const [publicApiUsage, setPublicApiUsage] = useState(null);
  const [reviewLinksClicksCount, setReviewLinksClicksCount] = useState(0);
  const [activeSection, setActiveSection] = useState<keyof typeof PAGES>("Search");

  const handleSetError = useCallback((error: Error) => {
    setError(error.message || error)
    setActiveSection("Search")
  }, [])

  const doSearch = useCallback((searchTrend: string) => {
    setSearchFor(searchTrend)
    setLoading(true)
    services.fetchData(searchTrend)
      .then(async (res) => {
        if (res) {
          if (typeof res[0] !== "string") {
            await sendGlobalMessage({action: globalActions.ADD_TO_HISTORY, searchTrend})
            setResult(res as LookupResult)
          } else {
            setSuggestions(res as string[])
          }
        }
        setActiveSection("Result")
      })
      .catch(handleSetError)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {

    sendGlobalMessage({action: globalActions.POPUP_INIT}).then(async (response) => {
      console.log({response});
      services.setAuth(response.options.apiKey, response.options.apiType)
      setOptions(response.options)
      setPublicApiUsage(response.publicApiUsage)
      setReviewLinksClicksCount(response.reviewLinkClicksCount)

      sendMessageToCurrentTab({
        action: globalActions.GET_SELECTED_TEXT,
        data: {from: "popup"}
      }).then((response = {}) => {
        if (response && response.data.selectedText) {
          setSearchFor(response.data.selectedText)
          doSearch(response.data.selectedText)
        }
      })
    })
  }, [])

  const handleSetOptions = (opts: OptionsType) => {
    sendGlobalMessage({
      action: globalActions.SET_OPTIONS,
      data: opts,
    }).then((res) => {
      if (res) {
        setOptions(res)
        setActiveSection("Search")

        // update apiUtils options as well
        services.setAuth(opts.apiKey, opts.apiType)

      }
    })
  }

  const countUpReviewLinksClicks = useCallback(() => {
    sendGlobalMessage({action: globalActions.COUNT_UP_REVIEW_LINK_CLICK}).then((count) => {
      setReviewLinksClicksCount(count)
    })
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
  ])

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export default DataProvider
