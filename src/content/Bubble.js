import {useCallback, useEffect, useState} from "react";
import {services} from "../shared/utils/services";
import {ERRORS, globalActions} from "../shared/utils/constants";
import {sendGlobalMessage} from "../shared/utils/messaging";
import styled, {createGlobalStyle} from "styled-components";
import {colors, spacings} from "../shared/utils/theme";
import BubbleResult from "./components/BubbleResult/BubbleResult";
import BubbleSuggestionList from "./components/BubbleResult/BubbleSuggestionList";

const GlobalStyle = createGlobalStyle`
  @import "https://fonts.googleapis.com/css?family=Roboto";
`

const StyledMessage = styled.p`
  font-size: 14px;
  line-height: 1.5;
  margin: ${spacings.s} 0 0;
  white-space: pre-line;
  color: ${colors.textDark};
`

const StyledBubble = styled.div`
  font-family: 'Roboto', Arial, sans-serif !important;
  font-size: 16px;
  box-sizing: border-box;
  border-radius: 4px;
  overflow: auto;
  border: ${colors.mainLight};
  background-color: ${colors.main};
  padding: 8px;
  height: 100%;
  max-height: 200px;
  box-shadow: 1px 1px 1px 0 #00000014;
  visibility: ${({$loading}) => $loading ? "hidden" : "visible"};
  
  a {
    text-decoration: none;
  }
`

const Bubble = ({searchFor}) => {
  const [result, setResult] = useState([])
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(true)

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
    <StyledBubble $loading={loading}>
      <GlobalStyle/>

      {showResult && <BubbleResult result={result} searchFor={searchFor}/>}

      {showSuggestionList && <BubbleSuggestionList onReSearch={doSearch}
                                                   searchFor={searchFor}
                                                   suggestions={result}/>}

      {!!error && <StyledMessage>{error}</StyledMessage>}
    </StyledBubble>
  )
}

export default Bubble