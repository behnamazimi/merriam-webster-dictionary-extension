import cx from "classnames";
import {useCallback, useEffect, useLayoutEffect, useState} from "react";
import {services} from "../shared/utils/services";
import {ERRORS, globalActions} from "../shared/utils/constants";
import {sendGlobalMessage} from "../shared/utils/messaging";
import BubbleResult from "./components/BubbleResult/BubbleResult";
import BubbleSuggestionList from "./components/BubbleResult/BubbleSuggestionList";
import styles from "./Bubble.styles.js"

const Bubble = ({searchFor}) => {
  const [result, setResult] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

  // add styles to shadow root
  useLayoutEffect(() => {
    const stylesElm = document.createElement("style")
    stylesElm.innerHTML = styles
    document.getElementById('mw-dic').shadowRoot.appendChild(stylesElm)
  }, [])

  const doSearch = useCallback((searchTrend) => {
    setLoading(true)
    services.fetchData(searchTrend)
      .then((res) => {
        sendGlobalMessage({action: globalActions.ADD_TO_HISTORY, searchTrend})
        setResult(res)
      })
      .catch(err => setError(err.message || err))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    doSearch(searchFor)
  }, [])

  if (error === ERRORS.NO_RESULT) {
    return null
  }

  const showSuggestionList = !!result?.length && typeof result[0] === "string"
  const showResult = !showSuggestionList && !loading && !error

  return (
    <div className={cx("Bubble", !loading && "loaded")}>
      {showResult && <BubbleResult result={result} searchFor={searchFor}/>}

      {showSuggestionList && <BubbleSuggestionList onReSearch={doSearch}
                                                   searchFor={searchFor}
                                                   suggestions={result}/>}

      {!!error && <div className="message">{error}</div>}
    </div>
  )
}

export default Bubble