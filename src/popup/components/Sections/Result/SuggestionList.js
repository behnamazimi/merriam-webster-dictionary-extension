import {useState} from "react";
import {useData} from "../../../context/data.context";
import {Spin} from "antd";
import styled from "styled-components";
import {colors, spacings} from "../../../../shared/utils/theme";
import {services} from "../../../../shared/utils/services";
import {sendGlobalMessage} from "../../../../shared/utils/messaging";
import {globalActions,} from "../../../../shared/utils/constants";

const StyledNoResult = styled.div`
  padding: 48px ${spacings.m} 0 ${spacings.m};
  color: ${colors.textDark};

  span {
    display: block;
    margin: ${spacings.s} 0;
    font-size: 14px;
  }
`

const StyledList = styled.ul`
  padding-left: ${spacings.l};
  margin-left: ${spacings.l};

  a {
    cursor: pointer;
  }
`

const SuggestionList = ({suggestions = []}) => {
  const [loading, setLoading] = useState(false)
  const {searchFor, setSearchFor, setResult, setError} = useData()
  if (!suggestions || !suggestions.length) return

  const shortedSearchFor = searchFor.substring(0, 12)

  const handleReSearch = (itemToSearchFor) => {
    setSearchFor(itemToSearchFor);
    setLoading(true)
    services.fetchData(itemToSearchFor)
      .then((res) => {
        sendGlobalMessage({action: globalActions.ADD_TO_HISTORY, searchTrend: itemToSearchFor})
        setResult(res)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }

  return (
    <Spin spinning={loading} delay={0}>
      <StyledNoResult>
        No result for "{shortedSearchFor}"!
        <span>Here are the similar ones to what you're looking for:</span>
      </StyledNoResult>
      <StyledList>
        {suggestions.map((item, index) => (
          <li key={index}>
            <a onClick={() => handleReSearch(item)}>{item}</a>
          </li>
        ))}
      </StyledList>
    </Spin>
  )
}

export default SuggestionList