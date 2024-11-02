import ActionButtons from "../../../../shared/components/ActionButtons";
import {useCallback, useEffect, useState} from "react";
import {loadHistory} from "../../../../shared/utils/storage";
import sortHistoryByDate from "../../../../shared/utils/sortHistoryByDate";
import {services} from "../../../../shared/utils/services";
import {sendGlobalMessage} from "../../../../shared/utils/messaging";
import {globalActions, PAGES} from "../../../../shared/utils/constants";
import {useData} from "../../../context/data.context";
import {FiX} from "react-icons/fi";

const useGetHistory = () => {
  const [history, setHistory] = useState({})

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

  const toggleReview = useCallback((key, review) => {
    sendGlobalMessage({action: globalActions.TOGGLE_HISTORY_REVIEW, key, review}, (updatedHistory) => {
      setHistory(updatedHistory)
    })

  }, [history, setHistory])

  const removeItem = useCallback((key) => {
    sendGlobalMessage({action: globalActions.REMOVE_HISTORY_ITEM, key}, (updatedHistory) => {
      setHistory(updatedHistory)
    })

  }, [history, setHistory])

  return [sortHistoryByDate(history), toggleReview, removeItem]
}

const History = () => {

  const {setSearchFor, setResult, setActiveSection, setError} = useData()
  const [history, toggleReview, removeItem] = useGetHistory()
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
            <li className="subtitle">
              Uncheck if you want to exclude phrases from being searched while in review mode.
            </li>
            {history.map(([key, count, review]) => (
              <li key={key + count}>
                <span>
                  <input type="checkbox"
                         checked={review}
                         onChange={() => toggleReview(key, !review)}/>
                  <a onClick={() => handleReSearch(key)}>{key}</a>
                </span>
                <span>
                  <small>{count > 1 ? ` ${count} times` : ""}</small>
                  <button title="Remove from history"
                          onClick={() => removeItem(key)}><FiX/></button>
                </span>
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