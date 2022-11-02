import ActionButtons from "../../../../shared/components/ActionButtons";
import {useEffect, useState} from "react";
import {loadHistory} from "../../../../shared/utils/storage";
import sortHistoryByDate from "../../../../shared/utils/sortHistoryByDate";
import {services} from "../../../../shared/utils/services";
import {sendGlobalMessage} from "../../../../shared/utils/messaging";
import {globalActions, PAGES} from "../../../../shared/utils/constants";
import {useData} from "../../../context/data.context";

const useGetSortedHistory = () => {
  const [history, setHistory] = useState([])

  useEffect(() => {
    loadHistory((res) => {
      setHistory(res)
    })

    const handleMessages = ({action}) => {
      if (action === globalActions.CLEAR_HISTORY) {
        setHistory([])
      }
    }

    chrome.runtime.onMessage.addListener(handleMessages)
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessages)
    }
  }, [])

  return sortHistoryByDate(history)
}

const History = () => {

  const {setSearchFor, setResult, setActiveSection, setError} = useData()
  const history = useGetSortedHistory()
  const [loading, setLoading] = useState(false)

  const handleReSearch = (searchTrend) => {
    setSearchFor(searchTrend);
    setLoading(true)
    services.fetchData(searchTrend)
      .then((res) => {
        sendGlobalMessage({action: globalActions.ADD_TO_HISTORY, searchTrend})
        setResult(res)
        setActiveSection(PAGES.Result)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }

  const handleHistoryCopy = (e) => {
    const textToCopy = history.map(([key]) => key).join(", ")
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        e.target.innerText = "Copied!"
        e.target.disabled = true
      })
  }

  return (
    <div className="History">
      {!!history && !!history.length ?
        <>
          <div className="title">Your lookup history:</div>
          <ul>
            {history.map(([key, count]) => (
              <li>
                <a onClick={() => handleReSearch(key)}>{key}</a>
                <small>{count > 1 ? ` ${count} times` : ""}</small>
              </li>
            ))}
          </ul>
        </>
        : <div className="no-result">No history item yet!</div>}

      <ActionButtons onHistoryCopy={handleHistoryCopy}/>
    </div>
  )
}

export default History