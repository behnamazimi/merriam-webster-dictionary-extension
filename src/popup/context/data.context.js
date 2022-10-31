import React, {useCallback, useContext, useEffect, useMemo, useState} from "react";
import {globalActions, PAGES} from "../../shared/utils/constants";
import {sendGlobalMessage, sendMessageToCurrentTab} from "../../shared/utils/messaging";
import {services} from "../../shared/utils/services";

const DataContext = React.createContext(null)

export const useData = () => useContext(DataContext)

const DataProvider = ({children}) => {
  const [searchFor, setSearchFor] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({});
  const [publicApiUsage, setPublicApiUsage] = useState(null);
  const [activeSection, setActiveSection] = useState(PAGES.Search);

  const handleSetError = useCallback((error) => {
    setError(error.message || error)
    setActiveSection(PAGES.Search)
  }, [])

  const doSearch = useCallback((searchTrend) => {
    setLoading(true)
    services.fetchData(searchTrend)
      .then((res) => {
        sendGlobalMessage({action: globalActions.ADD_TO_HISTORY, searchTrend})
        setResult(res)
        setActiveSection(PAGES.Result)
      })
      .catch(handleSetError)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {

    sendGlobalMessage({action: globalActions.POPUP_INIT}, async (response) => {
      services.setAuth(response.options.apiKey, response.options.apiType)
      setOptions(response.options)
      setPublicApiUsage(response.publicApiUsage)

      sendMessageToCurrentTab({action: globalActions.LINK_TO_POPUP}, (response = {}) => {
        if (response && response.selectedText) {
          setSearchFor(response.selectedText)
          doSearch(response.selectedText)
        }
      });
    })
  }, [])

  const handleSetOptions = (opts) => {
    sendGlobalMessage({
      action: globalActions.SET_OPTIONS,
      options: opts,
    }, (res) => {
      if (res) {
        setOptions(res)
        setActiveSection(PAGES.Search)

        // update apiUtils options as well
        services.setAuth(opts.apiKey, opts.apiType)

      }
    })
  }

  const value = useMemo(() => ({
    options,
    activeSection,
    publicApiUsage,
    setOptions: handleSetOptions,
    setActiveSection,
    result,
    setResult,
    searchFor,
    setSearchFor,
    error,
    setError: handleSetError,
    loading,
    doSearch
  }), [
    options, publicApiUsage, setOptions, activeSection, setActiveSection, result,
    searchFor, setSearchFor, error, setError,
    doSearch
  ])

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export default DataProvider